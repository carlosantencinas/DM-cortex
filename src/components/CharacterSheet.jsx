import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CLASS_OPTIONS, SPECIES_OPTIONS, BACKGROUND_OPTIONS, SIZE_OPTIONS } from '../data/characterOptions.js';
import SpellPicker from './SpellPicker.jsx';
import { useCharacters } from '../context/useCharacters';

const STATS = [['for','Fuerza','FUE'],['des','Destreza','DES'],['con','Constitución','CON'],['int','Inteligencia','INT'],['sab','Sabiduría','SAB'],['car','Carisma','CAR']];
const SKILLS = ['Acrobacias','Arcanos','Atletismo','Engaño','Historia','Interpretación','Intimidación','Investigación','Juego de Manos','Medicina','Naturaleza','Percepción','Perspicacia','Persuasión','Religión','Supervivencia','Trato con Animales','Sigilo'];
const SKILL_STAT = ['des','int','for','car','int','car','car','int','des','sab','int','sab','sab','car','int','sab','sab','des'];
const TABS = [['summary','General y Combate'],['spells','Hechizos y Magia'],['equipment','Inventario y Equipo'],['features','Rasgos y Trasfondo'],['notes','Bitácora y Notas']];
const DICE = [4,6,8,12,20];
const mod = n => Math.floor((Number(n || 10) - 10) / 2);
const signed = n => (n >= 0 ? '+' : '') + n;

function ChoiceField({ label, value, options, onChange }) {
  const normalized = options.map(option => typeof option === 'string' ? { value: option, label: option } : option);
  return <label className="field"><span>{label}</span><select value={value || ''} onChange={e => onChange(e.target.value)}><option value="">Seleccionar…</option>{normalized.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

export default function CharacterSheet() {
  const { characterId } = useParams();
  const { characters, updateCharacter, selectCharacter } = useCharacters();
  const character = characters.find(item => item.id === characterId) || null;
  const [tab, setTab] = useState('summary');
  const [dice, setDice] = useState(20);
  const [diceResult, setDiceResult] = useState(null);
  const [diceOpen, setDiceOpen] = useState(false);
  const [rolling, setRolling] = useState(false);

  useEffect(() => { if (characterId) selectCharacter(characterId); }, [characterId, selectCharacter]);

  const stats = useMemo(() => character ? STATS.map(([k, l, abbr]) => ({ k, l, abbr, v: character.stats?.[k] ?? 10, m: mod(character.stats?.[k]) })) : [], [character]);
  if (!character) return <section className="character-sheet sheet-shell"><div className="sheet-empty"><span className="sheet-kicker">DM CORTEX</span><h2>Personaje no encontrado</h2><p className="muted">Este personaje todavía no está disponible o fue eliminado.</p><Link className="sheet-button sheet-button-primary" to="/personajes">Volver a mis personajes</Link></div></section>;

  const hp = character.hp || { actual: 10, max: 10, temp: 0 };
  const hpPct = Math.max(0, Math.min(100, (hp.actual / Math.max(1, hp.max)) * 100));
  const save = data => updateCharacter(character.id, data);
  const roll = () => {
    if (rolling) return;
    setRolling(true);
    window.setTimeout(() => { setDiceResult(Math.floor(Math.random() * dice) + 1); setRolling(false); }, 520);
  };

  return <section className="character-sheet sheet-shell">
    <header className="sheet-globalbar">
      <div className="sheet-brand"><span className="sheet-d20-mark">◇</span><span>D&D 5e Companion</span></div>
      <span className="sheet-campaign-badge">◈ {character.campaignId ? 'Campaña activa' : 'Sin campaña'}</span>
      <nav className="sheet-globalnav"><Link to="/personajes">Personajes</Link><Link to="/campana">Campaña</Link><Link to="/dm">Monstruos</Link></nav>
      <div className="sheet-global-actions"><button className="sheet-search">⌕ Buscar conjuro, regla u objeto...</button><button className="sheet-dice-trigger" onClick={() => setDiceOpen(true)}>◈ Tirar Dado (d20)</button><span className="sheet-user">LVL {character.level || 1}</span></div>
    </header>
    <div className="sheet-identitybar">
      <div className="sheet-identity"><div className="sheet-avatar">{(character.name || '?').slice(0,1).toUpperCase()}</div><div><span className="sheet-kicker">PERSONAJE</span><h1>{character.name || 'Sin nombre'}</h1><p>{[character.race, character.class, character.subclass].filter(Boolean).join(' · ') || 'Configura tu personaje'}</p></div></div>
      <div className="sheet-quickstats">
        <div><span>PV</span><strong>{hp.actual}<small> / {hp.max}</small></strong><div className="sheet-hpbar"><i style={{width: hpPct + '%'}} /></div></div>
        <div><span>CA</span><strong>{character.ac || 10}</strong></div><div><span>INIC</span><strong>{signed(character.initiative || 0)}</strong></div><div><span>VEL</span><strong>{character.speed || 9}<small>m</small></strong></div><div><span>PP</span><strong>{character.passivePerception || 10}</strong></div>
      </div>
      <div className="sheet-rests"><button>Descanso corto</button><button>Descanso largo</button></div>
    </div>
    <div className="sheet-tabs-wrap"><nav className="sheet-tabs">{TABS.map(([id,label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{label}</button>)}</nav></div>
    <main className="sheet-content">
      {tab === 'summary' && <>
        <section className="sheet-panel"><div className="sheet-panel-head"><div><span className="sheet-kicker">ATRIBUTOS</span><h2>Características</h2></div><span className="sheet-hint">Modificadores calculados automáticamente</span></div><div className="sheet-stat-grid">{stats.map(s => <button className="sheet-stat" key={s.k} onClick={() => { setDice(20); setDiceOpen(true); }}><span>{s.abbr}</span><strong>{s.v}</strong><em>{signed(s.m)}</em></button>)}</div></section>
        <div className="sheet-main-grid">
          <section className="sheet-panel"><div className="sheet-panel-head"><div><span className="sheet-kicker">COMPETENCIAS</span><h2>Salvaciones</h2></div></div>{stats.map(s => { const proficient = !!character.savingThrows?.[s.k]; const value = s.m + (proficient ? character.proficiencyBonus || 2 : 0); return <label className="sheet-check-row" key={s.k}><input type="checkbox" checked={proficient} onChange={e => save({savingThrows:{...(character.savingThrows || {}),[s.k]:e.target.checked}})} /><span>{s.l}</span><b>{signed(value)}</b></label>; })}</section>
          <section className="sheet-panel"><div className="sheet-panel-head"><div><span className="sheet-kicker">HABILIDADES</span><h2>Skills</h2></div></div><div className="sheet-skill-grid">{SKILLS.map((skill,i) => { const key = SKILL_STAT[i]; const proficient = !!character.skills?.[skill]; const value = mod(character.stats?.[key]) + (proficient ? character.proficiencyBonus || 2 : 0); return <label className="sheet-check-row" key={skill}><input type="checkbox" checked={proficient} onChange={e => save({skills:{...(character.skills || {}),[skill]:e.target.checked}})} /><span>{skill}</span><b>{signed(value)}</b></label>; })}</div></section>
        </div>
        <section className="sheet-panel"><div className="sheet-panel-head"><div><span className="sheet-kicker">ORIGEN</span><h2>Identidad del aventurero</h2></div></div><div className="sheet-fields-grid"><ChoiceField label="Clase" value={character.class} options={CLASS_OPTIONS} onChange={value => save({class:value})}/><ChoiceField label="Especie" value={character.race} options={SPECIES_OPTIONS} onChange={value => save({race:value})}/><ChoiceField label="Trasfondo" value={character.background} options={BACKGROUND_OPTIONS} onChange={value => save({background:value})}/><ChoiceField label="Tamaño" value={character.size || 'Mediano'} options={SIZE_OPTIONS} onChange={value => save({size:value})}/></div></section>
        <section className="sheet-panel sheet-dice-strip"><div><span className="sheet-kicker">VTT</span><h2>Lanzador de dados poliédricos</h2><p>Elige un dado para abrir la bandeja de tirada.</p></div><div className="sheet-dice-buttons">{DICE.map(d => <button key={d} className={dice === d ? 'active' : ''} onClick={() => {setDice(d);setDiceOpen(true)}}>d{d}</button>)}</div></section>
      </>}
      {tab === 'spells' && <section className="sheet-panel"><div className="sheet-panel-head"><div><span className="sheet-kicker">MAGIA</span><h2>Libro de hechizos</h2></div></div><SpellPicker selected={character.spells || []} onChange={spells => save({spells})}/></section>}
      {tab === 'equipment' && <section className="sheet-panel"><div className="sheet-panel-head"><div><span className="sheet-kicker">EQUIPO</span><h2>Inventario y tesoros</h2></div></div><textarea rows={18} value={character.inventory || ''} onChange={e => save({inventory:e.target.value})} placeholder="Armas, armaduras, objetos, herramientas y tesoros…"/></section>}
      {tab === 'features' && <section className="sheet-panel"><div className="sheet-panel-head"><div><span className="sheet-kicker">RASGOS</span><h2>Rasgos y trasfondo</h2></div></div><textarea rows={18} value={character.features || ''} onChange={e => save({features:e.target.value})} placeholder="Rasgos de especie, clase, trasfondo, dotes y otros…"/></section>}
      {tab === 'notes' && <section className="sheet-panel"><div className="sheet-panel-head"><div><span className="sheet-kicker">BITÁCORA</span><h2>Notas de aventura</h2></div></div><textarea rows={18} value={character.notes || ''} onChange={e => save({notes:e.target.value})} placeholder="Objetivos, pistas, personajes, lugares, tesoros…"/></section>}
    </main>
    {diceOpen && <div className="dice-modal" onMouseDown={e => e.target === e.currentTarget && setDiceOpen(false)}><div className="dice-tray"><div className="dice-tray-head"><div><span className="sheet-kicker">VTT 3D POLIÉDRICO</span><h2>Lanzador de Dados 3D</h2><p>{character.name} · Tirada d{dice}</p></div><button onClick={() => setDiceOpen(false)}>×</button></div><div className="dice-selector">{DICE.map(d => <button key={d} className={dice === d ? 'active' : ''} onClick={() => setDice(d)}>d{d}</button>)}</div><div className="dice-stage"><div className={'css-die d' + dice + (rolling ? ' rolling' : '')}><span>{rolling ? '◆' : (diceResult || dice)}</span></div><div className="dice-glow" /></div><div className="dice-result">{diceResult ? <><span>Resultado</span><strong>{diceResult}</strong></> : <span>Elige un dado y lánzalo</span>}</div><button className="sheet-button sheet-button-primary dice-roll-button" onClick={roll}>{rolling ? 'Rodando…' : 'Lanzar d' + dice}</button></div></div>}
  </section>;
}