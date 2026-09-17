import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CLASS_OPTIONS, SPECIES_OPTIONS, BACKGROUND_OPTIONS, ALIGNMENT_OPTIONS, SIZE_OPTIONS, ABILITY_GENERATION_OPTIONS } from '../data/characterOptions.js';
import SpellPicker from './SpellPicker.jsx';
import { useCharacters } from '../context/useCharacters';

const STATS = [['for','Fuerza','FUE'],['des','Destreza','DES'],['con','Constitución','CON'],['int','Inteligencia','INT'],['sab','Sabiduría','SAB'],['car','Carisma','CAR']];
const SKILLS = ['Acrobacias','Arcanos','Atletismo','Engaño','Historia','Interpretación','Intimidación','Investigación','Juego de Manos','Medicina','Naturaleza','Percepción','Perspicacia','Persuasión','Religión','Supervivencia','Trato con Animales','Sigilo'];
const SKILL_STAT = ['des','int','for','car','int','car','car','int','des','sab','int','sab','sab','car','int','sab','sab','des'];
const TABS = [['summary','Resumen'],['spells','Hechizos'],['equipment','Equipo'],['features','Rasgos'],['notes','Notas']];
const mod = n => Math.floor((Number(n || 10) - 10) / 2);
const signed = n => `${n >= 0 ? '+' : ''}${n}`;

function ChoiceField({ label, value, options, onChange }) {
  const known = options.some(option => (typeof option === 'string' ? option : option.value) === value);
  const normalized = options.map(option => typeof option === 'string' ? { value: option, label: option } : option);
  return <label className="field"><span>{label}</span><select value={known ? value : ''} onChange={e => onChange(e.target.value)}><option value="">Seleccionar…</option>{normalized.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

export default function CharacterSheet() {
  const { characterId } = useParams();
  const { characters, updateCharacter, selectCharacter } = useCharacters();
  const character = characters.find(item => item.id === characterId) || null;
  const [tab, setTab] = useState('summary');

  if (!character) return <section className="character-sheet"><h2>Personaje no encontrado</h2><p className="muted">Este personaje todavía no está disponible o fue eliminado.</p><Link className="btn-primary" to="/personajes">Volver a mis personajes</Link></section>;

  selectCharacter(character.id);
  const stats = useMemo(() => STATS.map(([k, l, abbr]) => ({ k, l, abbr, v: character.stats?.[k] ?? 10, m: mod(character.stats?.[k]) })), [character.stats]);
  const hp = character.hp || { actual: 10, max: 10, temp: 0 };
  const hpPct = Math.max(0, Math.min(100, (hp.actual / Math.max(1, hp.max)) * 100));
  const save = (data) => updateCharacter(character.id, data);

  return <section className="character-sheet dnd-sheet">
    <div className="character-topbar">
      <Link to="/personajes" className="back-link">← Mis personajes</Link>
      <div className="character-actions"><button className="btn-secondary">Compartir</button><button className="btn-secondary">⋯</button></div>
    </div>

    <div className="dnd-character-header">
      <div className="character-portrait">{(character.name || '?').slice(0, 1).toUpperCase()}</div>
      <div className="character-title"><span className="eyebrow">PERSONAJE</span><h1>{character.name || 'Sin nombre'}</h1><p>{[character.race, character.class, character.subclass].filter(Boolean).join(' · ') || 'Configura tu personaje'}</p></div>
      <div className="header-stat"><span>NIVEL</span><strong>{character.level || 1}</strong></div>
      <div className="header-stat"><span>COMPETENCIA</span><strong>{signed(character.proficiencyBonus || 2)}</strong></div>
    </div>

    <div className="character-tabs">{TABS.map(([id,label]) => <button key={id} className={tab === id ? 'tab-active' : ''} onClick={() => setTab(id)}>{label}</button>)}</div>

    {tab === 'summary' && <>
      <div className="dnd-combat-strip">
        <div><span>PV</span><strong>{hp.actual} / {hp.max}</strong><div className="hp-bar"><div className="hp-fill" style={{width:`${hpPct}%`}} /></div></div>
        <div><span>CA</span><strong>{character.ac || 10}</strong></div>
        <div><span>INICIATIVA</span><strong>{signed(character.initiative || 0)}</strong></div>
        <div><span>VELOCIDAD</span><strong>{character.speed || 9} m</strong></div>
        <div><span>PERCEPCIÓN</span><strong>{character.passivePerception || 10}</strong></div>
      </div>

      <section className="section dnd-section"><div className="section-title"><h3>Características</h3><span className="muted">Modificadores calculados automáticamente</span></div><div className="dnd-stat-row">{stats.map(s => <div className="dnd-stat" key={s.k}><span>{s.abbr}</span><strong>{s.v}</strong><em>{signed(s.m)}</em></div>)}</div></section>

      <div className="dnd-two-column">
        <section className="section dnd-section"><div className="section-title"><h3>Salvaciones</h3></div>{stats.map(s => { const proficient = !!character.savingThrows?.[s.k]; const value = s.m + (proficient ? character.proficiencyBonus || 2 : 0); return <label className="dnd-check-row" key={s.k}><input type="checkbox" checked={proficient} onChange={e => save({savingThrows:{...(character.savingThrows || {}),[s.k]:e.target.checked}})} /><span>{s.l}</span><strong>{signed(value)}</strong></label>; })}</section>
        <section className="section dnd-section"><div className="section-title"><h3>Habilidades</h3></div>{SKILLS.map((skill,i) => { const key = SKILL_STAT[i]; const proficient = !!character.skills?.[skill]; const value = mod(character.stats?.[key]) + (proficient ? character.proficiencyBonus || 2 : 0); return <label className="dnd-check-row" key={skill}><input type="checkbox" checked={proficient} onChange={e => save({skills:{...(character.skills || {}),[skill]:e.target.checked}})} /><span>{skill}</span><strong>{signed(value)}</strong></label>; })}</section>
      </div>

      <section className="section dnd-section"><div className="section-title"><h3>Origen</h3></div><div className="grid grid-4"><ChoiceField label="Clase" value={character.class || ''} options={CLASS_OPTIONS} onChange={value => save({class:value})}/><ChoiceField label="Especie" value={character.race || ''} options={SPECIES_OPTIONS} onChange={value => save({race:value})}/><ChoiceField label="Trasfondo" value={character.background || ''} options={BACKGROUND_OPTIONS} onChange={value => save({background:value})}/><ChoiceField label="Tamaño" value={character.size || 'Mediano'} options={SIZE_OPTIONS} onChange={value => save({size:value})}/></div></section>
    </>}

    {tab === 'spells' && <section className="section dnd-section"><div className="section-title"><h3>Libro de hechizos</h3></div><SpellPicker selected={character.spells || []} onChange={spells => save({spells})}/></section>}

    {tab === 'equipment' && <section className="section dnd-section"><div className="section-title"><h3>Equipo e inventario</h3></div><textarea rows={18} value={character.inventory || ''} onChange={e => save({inventory:e.target.value})} placeholder="Añade armas, armaduras, objetos, herramientas y tesoros…"/></section>}

    {tab === 'features' && <section className="section dnd-section"><div className="section-title"><h3>Rasgos y características</h3></div><textarea rows={18} value={character.features || ''} onChange={e => save({features:e.target.value})} placeholder="Rasgos de especie, clase, trasfondo, dotes y otros…"/></section>}

    {tab === 'notes' && <section className="section dnd-section"><div className="section-title"><h3>Notas de aventura</h3></div><textarea rows={18} value={character.notes || ''} onChange={e => save({notes:e.target.value})} placeholder="Objetivos, pistas, personajes, lugares, tesoros…"/></section>}
  </section>;
}
