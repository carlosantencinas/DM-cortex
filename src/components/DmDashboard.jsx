import { useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCampaign } from '../context/useCampaign';

const conditions = ['Asustado', 'Paralizado', 'Envenenado', 'Cegado', 'Incapacitado'];
const conditionText = {
  Asustado: 'Desventaja en pruebas de característica y tiradas de ataque mientras la fuente del miedo esté a la vista. No puede acercarse voluntariamente a la fuente.',
  Paralizado: 'Incapacitado, no puede moverse ni hablar. Falla salvaciones de FUE y DES automáticamente. Ataques a 5 pies son impactos críticos automáticos.',
  Envenenado: 'Desventaja en tiradas de ataque y pruebas de característica.',
  Cegado: 'Falla automáticamente cualquier prueba que requiera vista. Ataques contra la criatura tienen ventaja y sus ataques tienen desventaja.',
  Incapacitado: 'No puede realizar acciones ni reacciones.',
};

const dcOptions = [['Fácil',10],['Media',15],['Difícil',20],['Muy difícil',25]];

function combatantFromCharacter(c) {
  return {
    id: c.id,
    sourceId: c.id,
    type: 'PJ',
    name: c.name || 'Personaje',
    initiative: Number(c.initiative || 0),
    hp: Number(c.hp?.actual ?? 0),
    maxHp: Number(c.hp?.max ?? 0),
    ac: Number(c.ac || 10),
    conditions: c.conditions || [],
    status: c.status || '',
    description: [c.race, c.class].filter(Boolean).join(' · ') || 'Jugador',
  };
}

export default function DmDashboard() {
  const { campaignId, campaign, isDm } = useCampaign();
  const [characters, setCharacters] = useState([]);
  const [encounter, setEncounter] = useState(null);
  const [npcs, setNpcs] = useState([]);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState('');
  const [condition, setCondition] = useState('');
  const [privacy, setPrivacy] = useState(true);
  const [combatPulse, setCombatPulse] = useState(false);
  const [busy, setBusy] = useState(false);
  const [diceResult, setDiceResult] = useState(null);

  useEffect(() => {
    if (!campaignId) return undefined;
    return onSnapshot(collection(db, 'campaigns', campaignId, 'characters'),
      snapshot => setCharacters(snapshot.docs.map(item => ({ id: item.id, ...item.data() }))),
      error => console.error('No se pudieron cargar los personajes:', error));
  }, [campaignId]);

  useEffect(() => {
    if (!campaignId) return undefined;
    const ref = doc(db, 'campaigns', campaignId, 'encounters', 'current');
    return onSnapshot(ref, snap => setEncounter(snap.exists() ? snap.data() : null),
      error => console.error('No se pudo cargar el encuentro:', error));
  }, [campaignId]);

  useEffect(() => {
    if (!campaignId) return undefined;
    const unsubscribe = onSnapshot(collection(db, 'campaigns', campaignId, 'npcs'),
      snapshot => setNpcs(snapshot.docs.map(item => ({ id: item.id, ...item.data() }))),
      error => console.error('No se pudieron cargar los PNJs:', error));
    return unsubscribe;
  }, [campaignId]);

  useEffect(() => {
    if (!campaignId) return undefined;
    return onSnapshot(collection(db, 'campaigns', campaignId, 'dmNotes'),
      snapshot => setNotes(snapshot.docs.map(item => ({ id: item.id, ...item.data() })).sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))),
      error => console.error('No se pudieron cargar las notas DM:', error));
  }, [campaignId]);

  useEffect(() => {
    if (!campaignId || encounter) return;
    const combatants = characters.map(combatantFromCharacter).sort((a,b) => b.initiative - a.initiative);
    if (!combatants.length) return;
    setDoc(doc(db, 'campaigns', campaignId, 'encounters', 'current'), {
      name: 'Encuentro actual', round: 1, activeIndex: 0, status: 'ready', combatants, updatedAt: serverTimestamp(),
    }, { merge: true }).catch(error => console.error('No se pudo iniciar el encuentro:', error));
  }, [campaignId, encounter, characters]);

  const combatants = encounter?.combatants || characters.map(combatantFromCharacter).sort((a,b) => b.initiative - a.initiative);
  const activeIndex = Math.min(Math.max(0, encounter?.activeIndex || 0), Math.max(0, combatants.length - 1));
  const hp = useMemo(() => characters.reduce((total, c) => total + Number(c.hp?.actual || 0), 0), [characters]);
  const avgLevel = useMemo(() => {
    if (!characters.length) return 0;
    return (characters.reduce((sum,c) => sum + Number(c.level || 1),0) / characters.length).toFixed(1);
  }, [characters]);

  if (!campaignId || !campaign) return <div className="dm-console stitch-card"><span className="stitch-kicker">DUNGEON MASTER</span><h1>Tu mesa aún no está activa</h1><p>Crea una campaña desde el Lobby para abrir el panel táctico.</p></div>;
  if (!isDm) return <div className="dm-console stitch-card"><span className="stitch-kicker">ACCESO RESTRINGIDO</span><h1>Panel del DM</h1><p>El panel de <b>{campaign.name}</b> pertenece al Dungeon Master.</p></div>;

  const saveEncounter = async patch => {
    setBusy(true);
    try {
      await setDoc(doc(db, 'campaigns', campaignId, 'encounters', 'current'), {...patch, updatedAt: serverTimestamp()}, {merge:true});
    } finally { setBusy(false); }
  };

  const nextTurn = () => {
    if (!combatants.length) return;
    const nextIndex = (activeIndex + 1) % combatants.length;
    saveEncounter({activeIndex:nextIndex, round: activeIndex === combatants.length - 1 ? Number(encounter?.round || 1) + 1 : Number(encounter?.round || 1)});
  };

  const previousTurn = () => {
    if (!combatants.length) return;
    const previousIndex = activeIndex === 0 ? combatants.length - 1 : activeIndex - 1;
    saveEncounter({activeIndex:previousIndex, round: activeIndex === 0 ? Math.max(1,Number(encounter?.round || 1)-1) : Number(encounter?.round || 1)});
  };

  const addCreature = async () => {
    const name = window.prompt('Nombre de criatura o monstruo:', 'Criatura');
    if (!name?.trim()) return;
    const initiative = Number(window.prompt('Iniciativa:', '10')) || 0;
    const maxHp = Number(window.prompt('Puntos de golpe máximos:', '20')) || 1;
    const ac = Number(window.prompt('Clase de armadura:', '12')) || 10;
    const id = 'creature-' + Date.now();
    await saveEncounter({combatants:[...combatants,{id,type:'Monstruo',name:name.trim(),initiative,hp:maxHp,maxHp,ac,conditions:[],description:'Criatura añadida por el DM'}],status:'combat'});
  };

  const updateCombatant = (id, patch) => saveEncounter({combatants:combatants.map(c => c.id === id ? {...c,...patch} : c)});

  const groupChange = async amount => {
    const value = Number(window.prompt(amount > 0 ? 'Sanación para el grupo:' : 'Daño para el grupo:', String(Math.abs(amount))));
    if (!Number.isFinite(value) || value <= 0) return;
    const delta = amount > 0 ? value : -value;
    await Promise.all(characters.map(c => {
      const current = Number(c.hp?.actual || 0), max = Number(c.hp?.max || current);
      const next = Math.max(0, Math.min(max, current + delta));
      return setDoc(doc(db,'campaigns',campaignId,'characters',c.id), {hp:{...(c.hp || {}),actual:next},updatedAt:serverTimestamp()},{merge:true});
    }));
  };

  const saveNote = async () => {
    if (!note.trim()) return;
    await setDoc(doc(collection(db,'campaigns',campaignId,'dmNotes')), {text:note.trim(),createdAt:serverTimestamp()});
    setNote('');
  };

  const addNpc = async () => {
    const name = window.prompt('Nombre del PNJ:', 'Nuevo PNJ');
    if (!name?.trim()) return;
    const disposition = window.prompt('Estado/disposición:', 'Neutral') || 'Neutral';
    await setDoc(doc(collection(db,'campaigns',campaignId,'npcs')), {name:name.trim(),disposition,description:'PNJ en escena',presence:true,createdAt:serverTimestamp()});
  };

  const roll = sides => {
    const value = Math.floor(Math.random()*sides)+1;
    setDiceResult('d'+sides+': '+value);
  };

  const rollInitiative = async () => {
    const updated = combatants.map(c => ({...c, initiative:Math.floor(Math.random()*20)+1})).sort((a,b)=>b.initiative-a.initiative);
    setCombatPulse(true);
    await saveEncounter({combatants:updated,activeIndex:0,round:1,status:'combat'});
    window.setTimeout(()=>setCombatPulse(false),1200);
  };

  return <section className="dm-console">
    <header className="dm-console-head">
      <div><span className="stitch-kicker">PANEL DEL DUNGEON MASTER</span><h1>{campaign.name}</h1><p>{characters.length} héroe(s) · Nivel medio {avgLevel} · estado de mesa en tiempo real</p></div>
      <div className="dm-head-actions"><span className="privacy-pill">{privacy?'◉ Pantalla DM: Privada':'◉ Pantalla DM: Abierta'}</span><span className="invite-code">{campaign.inviteCode}</span></div>
    </header>

    <section className="dm-atmosphere stitch-card">
      <div><div className="dm-live-row"><span className="live-dot"/> Sesión en vivo <span>•</span><span>Campaña activa</span><span>•</span><span>{campaign.system || 'D&D 2024'}</span></div><h2>{campaign.name}</h2><p>{campaign.description || 'La mesa está lista. El estado táctico se sincroniza en tiempo real.'}</p></div>
      <div className="dm-commandbar">
        <div className="dm-environment"><span>☁</span><div><small>CLIMA & TIEMPO</small><b>Escena actual</b></div></div>
        <button className={'stitch-primary '+(combatPulse?'combat-pulse':'')} onClick={rollInitiative}>⚔ Tirar iniciativa grupal</button>
        <button className="stitch-secondary" onClick={()=>setPrivacy(v=>!v)}>{privacy?'◉ Privada':'◉ Abierta'}</button>
      </div>
    </section>

    <div className="dm-statbar">
      <div><small>GRUPO</small><strong>{characters.length}</strong></div><div><small>PV ACTUALES</small><strong>{hp}</strong></div><div><small>RONDA</small><strong>{encounter?.round || 1}</strong></div><div><small>CÓDIGO</small><strong>{campaign.inviteCode}</strong></div>
    </div>

    <div className="dm-layout">
      <main className="dm-main">
        <section className="stitch-card party-monitor">
          <div className="dm-section-head"><div><span className="stitch-kicker">PARTY VITALS</span><h2>Monitor del Grupo</h2><span className="dm-muted">{characters.length} héroes en el grupo · Nivel medio {avgLevel}</span></div><div className="dm-batch-actions"><button className="stitch-secondary" onClick={()=>groupChange(-1)}>🔥 Daño en Área</button><button className="stitch-secondary" onClick={()=>groupChange(1)}>♥ Sanación Grupal</button></div></div>
          <div className="party-grid">{characters.map(c=>{const current=Number(c.hp?.actual||0),max=Math.max(1,Number(c.hp?.max||1)),pct=Math.max(0,Math.min(100,current/max*100));return <article className="party-card" key={c.id}><div className="party-card-head"><div><b>{c.name||'Personaje'}</b><span>Nv. {c.level||1} · {c.race||'—'} · {c.class||'—'}</span></div><button className="inspiration-btn" onClick={()=>setDoc(doc(db,'campaigns',campaignId,'characters',c.id),{inspiration:!c.inspiration,updatedAt:serverTimestamp()},{merge:true})}>{c.inspiration?'★ Activa':'☆ Insp.'}</button></div><div className="party-hp"><span>PG <b>{current}</b> / {max}</span><i><b style={{width:pct+'%'}}/></i></div><div className="party-meta"><span>CA <b>{c.ac||10}</b></span><span>INIC <b>{c.initiative??0}</b></span><button onClick={()=>updateCombatant(c.id,{hp:current,maxHp:max,ac:c.ac||10})}>Añadir al combate</button></div></article>})}</div>
          {characters.length===0&&<p className="muted">Aún no hay personajes vinculados a esta campaña.</p>}
        </section>

        <section id="combatEncounterPanel" className={'stitch-card combat-panel '+(combatPulse?'combat-highlight':'')}>
          <div className="dm-section-head"><div><span className="stitch-kicker">ENCUENTRO · RONDA {encounter?.round||1}</span><h2>Rastreador de Iniciativa</h2></div><div className="tracker-actions"><button className="stitch-secondary" onClick={previousTurn}>← Turno</button><button className="stitch-primary" onClick={nextTurn}>Siguiente →</button><button className="stitch-secondary" onClick={addCreature}>＋ Añadir criatura</button></div></div>
          <div className="turn-list">{combatants.map((c,index)=>{const maxHp=Math.max(1,Number(c.maxHp||1)),pct=Math.max(0,Math.min(100,Number(c.hp||0)/maxHp*100)),active=index===activeIndex;return <article className={'turn-row '+(active?'turn-active ':'')+(c.type==='Monstruo'?'monster-row':'')} key={c.id}><div className="initiative">{c.initiative??0}</div><div className="turn-info"><strong>{c.name}</strong><span>{c.type||'PJ'} · {c.description||'—'}</span>{c.conditions?.length>0&&<small>{c.conditions.join(' · ')}</small>}</div><div className="turn-hp"><span>PG {c.hp??0}/{c.maxHp??0} · CA {c.ac??10}</span><i><b style={{width:pct+'%'}}/></i></div><div className="turn-actions"><button className="combat-action" onClick={()=>updateCombatant(c.id,{hp:Math.max(0,Number(c.hp||0)-Number(window.prompt('Daño a '+c.name+':','5')||0))})}>⚔ Atacar</button><button className="mini-action" onClick={()=>updateCombatant(c.id,{hp:Math.min(maxHp,Number(c.hp||0)+Number(window.prompt('Curación a '+c.name+':','5')||0))})}>♥</button></div></article>})}{!combatants.length&&<p className="muted">Pulsa “Tirar iniciativa grupal” para iniciar el encuentro.</p>}</div>
        </section>

        <section className="dm-quick-grid"><div className="stitch-card"><span className="stitch-kicker">TIRADAS RÁPIDAS</span><h2>Dado del DM</h2><div className="dm-dice">{[20,12,10,8,6,4].map(d=><button key={d} onClick={()=>roll(d)}>d{d}</button>)}</div>{diceResult&&<div className="dm-dice-result">{diceResult}</div>}</div><div className="stitch-card"><span className="stitch-kicker">CD</span><h2>Reglas rápidas & CDs</h2><div className="dc-grid">{dcOptions.map(([label,value])=><button key={value} onClick={()=>navigator.clipboard?.writeText(String(value))}><span>{label}</span><em>CD {value}</em></button>)}</div></div></section>
      </main>

      <aside className="dm-side">
        <section className="stitch-card"><div className="dm-side-title"><span>🔒</span><h2>Bitácora & Secretos DM</h2><b>Solo ojos DM</b></div>{notes.slice(0,3).map(n=><div className="secret-note" key={n.id}><p>{n.text}</p></div>)}<textarea rows="3" value={note} onChange={e=>setNote(e.target.value)} placeholder="Añadir nota rápida de la sesión…"/><button className="stitch-secondary full-width" disabled={busy||!note.trim()} onClick={saveNote}>{busy?'Guardando…':'Guardar nota'}</button></section>

        <section className="stitch-card"><div className="dm-side-title"><span>♙</span><h2>PNJs en escena</h2><b>{npcs.filter(n=>n.presence!==false).length} presentes</b></div>{npcs.map(n=><div className="npc-row" key={n.id}><div><strong>{n.name}</strong><span className={n.disposition==='Hostil'?'hostile':''}>{n.disposition||'Neutral'}</span><small>{n.description||'En escena'}</small></div><button onClick={()=>setDoc(doc(db,'campaigns',campaignId,'npcs',n.id),{presence:!n.presence,updatedAt:serverTimestamp()},{merge:true})}>{n.presence===false?'Oculto':'Presente'}</button></div>)}{!npcs.length&&<div className="npc-empty">No hay PNJs. Añade el primero para llevar su presencia y disposición.</div>}<button className="stitch-secondary full-width" onClick={addNpc}>＋ Añadir PNJ</button></section>

        <section className="stitch-card"><div className="dm-side-title"><span>☷</span><h2>Condiciones rápidas</h2></div><div className="condition-list">{conditions.map(item=><button key={item} className={condition===item?'selected':''} onClick={()=>setCondition(item)}>{item}</button>)}</div>{condition&&<p className="condition-detail"><b>{condition}:</b> {conditionText[condition]}</p>}<div className="dm-reference"><div><span>Cobertura media</span><b>+2 CA / DES</b></div><div><span>Tres cuartos</span><b>+5 CA</b></div><div><span>Luz tenue</span><b>Desventaja Percepción</b></div></div></section>
      </aside>
    </div>
  </section>;
}
