import { useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useCampaign } from '../context/useCampaign';
import SpellPicker from './SpellPicker.jsx';
import {
  CLASS_OPTIONS,
  SPECIES_OPTIONS,
  BACKGROUND_OPTIONS,
  ALIGNMENT_OPTIONS,
  SIZE_OPTIONS,
  ABILITY_GENERATION_OPTIONS,
} from '../data/characterOptions.js';

const STATS = [['for','Fuerza','FUE'],['des','Destreza','DES'],['con','Constitución','CON'],['int','Inteligencia','INT'],['sab','Sabiduría','SAB'],['car','Carisma','CAR']];
const SKILLS = ['Acrobacias','Arcanos','Atletismo','Engaño','Historia','Interpretación','Intimidación','Investigación','Juego de Manos','Medicina','Naturaleza','Percepción','Perspicacia','Persuasión','Religión','Supervivencia','Trato con Animales','Sigilo'];
const SKILL_STAT = ['des','int','for','car','int','car','car','int','des','sab','int','sab','sab','car','int','sab','sab','des'];
const BLANK = {name:'',player:'',class:'',subclass:'',level:1,race:'',background:'',alignment:'',size:'Mediano',abilityGeneration:'standard',xp:0,proficiencyBonus:2,speed:9,ac:10,initiative:0,passivePerception:10,hitDice:'1d8',stats:{for:10,des:10,con:10,int:10,sab:10,car:10},savingThrows:{},skills:{},hp:{actual:10,max:10,temp:0},spells:[],inventory:'',attacks:[],features:'',personality:'',ideals:'',bonds:'',flaws:'',languages:'',proficiencies:'',notes:''};
const mod = n => Math.floor((Number(n || 10)-10)/2);
const signed = n => `${n >= 0 ? '+' : ''}${n}`;

function ChoiceField({ label, value, options, onChange, customPlaceholder = 'Escribe una opción personalizada…' }) {
  const known = options.includes(value);
  const selectValue = known ? value : (value ? '__custom__' : '');
  return <label className="field choice-field">
    <span>{label}</span>
    <select value={selectValue} onChange={e => onChange(e.target.value === '__custom__' ? '' : e.target.value)}>
      <option value="">Seleccionar…</option>
      {options.map(option => <option key={option} value={option}>{option}</option>)}
      <option value="__custom__">Personalizado…</option>
    </select>
    {!known && value && <input className="custom-choice" value={value} placeholder={customPlaceholder} onChange={e => onChange(e.target.value)} />}
  </label>;
}

export default function CharacterSheet(){
  const {user}=useAuth();
  const {campaignId,campaign,createCampaign,joinCampaignByCode}=useCampaign();
  const [character,setCharacter]=useState(BLANK);
  const [joinCode,setJoinCode]=useState('');
  const [newCampaignName,setNewCampaignName]=useState('');
  const [status,setStatus]=useState('');

  useEffect(()=>{
    if(!campaignId||!user)return;
    const ref=doc(db,'campaigns',campaignId,'characters',user.uid);
    return onSnapshot(ref,s=>{
      if(s.exists()){
        const d=s.data();
        setCharacter({...BLANK,...d,stats:{...BLANK.stats,...d.stats},hp:{...BLANK.hp,...d.hp}});
      }
    });
  },[campaignId,user]);

  async function save(next){
    setCharacter(next);
    if(!campaignId||!user)return;
    await setDoc(doc(db,'campaigns',campaignId,'characters',user.uid),{...next,ownerUid:user.uid,updatedAt:serverTimestamp()},{merge:true});
  }

  const update=(key,value)=>save({...character,[key]:value});
  const stats=useMemo(()=>STATS.map(([k,l,abbr])=>({k,l,abbr,v:character.stats[k],m:mod(character.stats[k])})),[character.stats]);
  const hpPct=Math.max(0,Math.min(100,(character.hp.actual/Math.max(1,character.hp.max))*100));

  if(!campaignId)return <div className="onboarding"><div className="eyebrow">DM CORTEX</div><h2>Entra en tu aventura</h2><p className="muted">Únete con el código de tu DM o crea una campaña propia.</p><div className="onboarding-row"><input placeholder="Código de invitación" value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())}/><button className="btn-primary" onClick={async()=>{try{await joinCampaignByCode(joinCode)}catch(e){setStatus(e.message)}}}>Unirme</button></div><hr/><div className="onboarding-row"><input placeholder="Nombre de campaña nueva" value={newCampaignName} onChange={e=>setNewCampaignName(e.target.value)}/><button className="btn-secondary" onClick={()=>createCampaign(newCampaignName)}>Crear campaña</button></div>{status&&<p className="error">{status}</p>}</div>;

  return <div className="character-sheet">
    {campaign&&<div className="campaign-badge"><span>Campaña <strong>{campaign.name}</strong></span><span>Código <code>{campaign.inviteCode}</code></span></div>}

    <div className="sheet-hero"><div className="hero-fields">
      <label className="field"><span>Nombre del personaje</span><input className="hero-name" value={character.name} onChange={e=>update('name',e.target.value)} /></label>
      <ChoiceField label="Clase" value={character.class} options={CLASS_OPTIONS} onChange={v=>update('class',v)} />
      <label className="field"><span>Nivel</span><input type="number" min="1" max="20" value={character.level} onChange={e=>update('level',Math.max(1,Math.min(20,Number(e.target.value))))}/></label>
      <ChoiceField label="Especie" value={character.race} options={SPECIES_OPTIONS} onChange={v=>update('race',v)} />
      <ChoiceField label="Trasfondo" value={character.background} options={BACKGROUND_OPTIONS} onChange={v=>update('background',v)} />
    </div></div>

    <section className="section"><div className="section-title"><div><h3>Origen y creación</h3><span className="muted">Elecciones rápidas al estilo de un constructor de personajes</span></div></div><div className="grid grid-4">
      <ChoiceField label="Subclase" value={character.subclass} options={['Sin subclase','Personalizada']} onChange={v=>update('subclass',v)} />
      <ChoiceField label="Tamaño" value={character.size} options={SIZE_OPTIONS} onChange={v=>update('size',v)} />
      <ChoiceField label="Método de características" value={character.abilityGeneration} options={ABILITY_GENERATION_OPTIONS.map(x=>x.label)} onChange={v=>update('abilityGeneration',v)} />
      <ChoiceField label="Alineamiento" value={character.alignment} options={ALIGNMENT_OPTIONS} onChange={v=>update('alignment',v)} />
    </div></section>

    <section className="section"><div className="section-title"><h3>Identidad</h3></div><div className="grid grid-4">
      <label className="field"><span>Jugador</span><input value={character.player} onChange={e=>update('player',e.target.value)}/></label>
      <label className="field"><span>Experiencia</span><input type="number" value={character.xp} onChange={e=>update('xp',Number(e.target.value))}/></label>
      <label className="field"><span>Competencia</span><input type="number" value={character.proficiencyBonus} onChange={e=>update('proficiencyBonus',Number(e.target.value))}/></label>
      <label className="field"><span>Velocidad</span><input type="number" value={character.speed} onChange={e=>update('speed',Number(e.target.value))}/></label>
    </div></section>

    <section className="section stats-section"><div className="section-title"><div><h3>Características</h3><span className="muted">Valores y modificadores</span></div><span className="stat-order">FUE · DES · CON · INT · SAB · CAR</span></div><div className="stat-grid-scroll"><div className="stat-grid stat-grid-fixed">{stats.map(s=><div className="stat-card" key={s.k}><div className="stat-abbr">{s.abbr}</div><div className="stat-label stat-title">{s.l}</div><input aria-label={s.l} type="number" value={s.v} onChange={e=>save({...character,stats:{...character.stats,[s.k]:Number(e.target.value)}})}/><div className="modifier">{signed(s.m)}</div></div>)}</div></div></section>

    <section className="section"><div className="section-title"><h3>Combate</h3></div><div className="combat-grid">{[['ac','CA'],['initiative','Iniciativa'],['speed','Velocidad'],['passivePerception','Percepción pasiva'],['hitDice','Dados de golpe']].map(([k,l])=><label className="combat-box" key={k}><span className="mini-label">{l}</span><input className="combat-value" value={character[k]} onChange={e=>update(k,k==='hitDice'?e.target.value:Number(e.target.value))}/></label>)}</div><div className="hp-row" style={{marginTop:'.8rem'}}><label className="field"><span>PV actuales</span><input type="number" value={character.hp.actual} onChange={e=>save({...character,hp:{...character.hp,actual:Number(e.target.value)}})}/><div className="hp-bar"><div className="hp-fill" style={{width:`${hpPct}%`}}/></div></label><label className="field"><span>PV máximos</span><input type="number" value={character.hp.max} onChange={e=>save({...character,hp:{...character.hp,max:Number(e.target.value)}})}/></label><label className="field"><span>PV temporales</span><input type="number" value={character.hp.temp} onChange={e=>save({...character,hp:{...character.hp,temp:Number(e.target.value)}})}/></label></div></section>

    <section className="section"><div className="section-title"><h3>Salvaciones</h3></div><div className="grid grid-3">{stats.map(s=><label className="field" key={s.k}><span>{s.l} · {signed(s.m+(character.savingThrows?.[s.k]?character.proficiencyBonus:0))}</span><input type="checkbox" checked={!!character.savingThrows?.[s.k]} onChange={e=>save({...character,savingThrows:{...character.savingThrows,[s.k]:e.target.checked}})}/></label>)}</div></section>

    <section className="section"><div className="section-title"><h3>Habilidades</h3></div><div className="grid grid-3">{SKILLS.map((skill,i)=>{const k=SKILL_STAT[i];const value=mod(character.stats[k])+(character.skills?.[skill]?character.proficiencyBonus:0);return <label className="field" key={skill}><span>{skill} · {signed(value)}</span><input type="checkbox" checked={!!character.skills?.[skill]} onChange={e=>save({...character,skills:{...character.skills,[skill]:e.target.checked}})}/></label>})}</div></section>

    <section className="section"><div className="section-title"><h3>Hechizos</h3></div><SpellPicker selected={character.spells} onChange={spells=>update('spells',spells)}/></section>

    <section className="section"><div className="section-title"><h3>Ataques y acciones</h3><button className="btn-secondary" onClick={()=>update('attacks',[...character.attacks,{name:'',bonus:'',damage:'',notes:''}])}>+ Añadir</button></div>{character.attacks.map((a,i)=><div className="attack-row" key={i}><input placeholder="Arma / acción" value={a.name} onChange={e=>{const x=[...character.attacks];x[i]={...a,name:e.target.value};update('attacks',x)}}/><input placeholder="Bonif." value={a.bonus} onChange={e=>{const x=[...character.attacks];x[i]={...a,bonus:e.target.value};update('attacks',x)}}/><input placeholder="Daño" value={a.damage} onChange={e=>{const x=[...character.attacks];x[i]={...a,damage:e.target.value};update('attacks',x)}}/><input placeholder="Notas" value={a.notes} onChange={e=>{const x=[...character.attacks];x[i]={...a,notes:e.target.value};update('attacks',x)}}/></div>)}</section>

    <section className="section"><div className="section-title"><h3>Rasgos, personalidad y equipo</h3></div><div className="grid grid-2">{[['features','Rasgos y características'],['inventory','Equipo e inventario'],['personality','Personalidad'],['ideals','Ideales'],['bonds','Vínculos'],['flaws','Defectos'],['languages','Idiomas'],['proficiencies','Competencias']].map(([k,l])=><label className="field" key={k}><span>{l}</span><textarea rows={k==='inventory'||k==='features'?5:3} value={character[k]} onChange={e=>update(k,e.target.value)}/></label>)}</div></section>

    <section className="section"><div className="section-title"><h3>Notas de aventura</h3></div><textarea rows={7} value={character.notes} onChange={e=>update('notes',e.target.value)} placeholder="Objetivos, pistas, tesoros, historia…"/></section>
  </div>;
}
