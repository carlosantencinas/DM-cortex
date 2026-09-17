import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CLASS_OPTIONS, SPECIES_OPTIONS, BACKGROUND_OPTIONS, ALIGNMENT_OPTIONS, ABILITY_GENERATION_OPTIONS } from '../data/characterOptions.js';
import { useCharacters } from '../context/useCharacters';

const STEPS = [['class','Clase'],['origin','Origen'],['abilities','Características'],['details','Detalles'],['finish','Confirmar']];
const stats = [['for','Fuerza'],['des','Destreza'],['con','Constitución'],['int','Inteligencia'],['sab','Sabiduría'],['car','Carisma']];

export default function CharacterBuilder() {
  const navigate = useNavigate();
  const { createCharacter } = useCharacters();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [data, setData] = useState({ name:'', class:'', race:'', background:'', alignment:'', level:1, player:'', abilityMethod:'standard', stats:{for:15,des:14,con:13,int:12,sab:10,car:8} });
  const set = patch => setData(current => ({...current,...patch}));
  const setStat = (key,value) => set({stats:{...data.stats,[key]:Number(value)}});
  const next = () => { if (step === 0 && !data.class) return setError('Selecciona una clase.'); if (step === 1 && (!data.race || !data.background)) return setError('Selecciona especie y trasfondo.'); setError(''); setStep(value => Math.min(STEPS.length - 1, value + 1)); };

  const finish = async () => {
    if (creating) return;
    if (!data.name.trim()) return setError('Escribe el nombre del personaje.');
    setError('');
    setCreating(true);
    try {
      const id = await createCharacter({ ...data, name: data.name.trim(), level: Number(data.level) || 1 });
      // Navigate immediately to the newly-created sheet. The hard navigation
      // fallback also handles stale GitHub Pages SPA state after creation.
      navigate(`/personaje/${id}`, { replace: true });
      window.setTimeout(() => {
        if (window.location.pathname.includes('/personajes/nuevo')) {
          const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
          window.location.assign(`${base}personaje/${id}`);
        }
      }, 700);
    } catch (e) {
      setCreating(false);
      setError(e?.message || 'No se pudo crear el personaje.');
    }
  };

  return <section className="character-builder">
    <div className="builder-top"><Link to="/personajes" className="back-link">← Mis personajes</Link><span className="eyebrow">CREADOR DE PERSONAJE · D&D 2024</span></div>
    <div className="builder-head"><div><h1>Crea tu personaje</h1><p className="muted">Construye el personaje paso a paso. Podrás modificarlo después desde su hoja.</p></div><span className="builder-count">{step + 1} / {STEPS.length}</span></div>
    <div className="builder-steps">{STEPS.map(([id,label],index)=><button type="button" key={id} className={index===step?'step-active':index<step?'step-done':''} onClick={()=>index<step&&setStep(index)}><b>{index+1}</b><span>{label}</span></button>)}</div>

    <div className="builder-panel">
      {step===0 && <><div className="section-title"><h2>Elige tu clase</h2><span className="muted">Tu clase define tus capacidades principales.</span></div><div className="option-grid">{CLASS_OPTIONS.map(option=><button type="button" key={option} className={`choice-card ${data.class===option?'choice-selected':''}`} onClick={()=>set({class:option})}><strong>{option}</strong><span>Ver características, competencias y opciones</span></button>)}</div></>}
      {step===1 && <><div className="section-title"><h2>Define tu origen</h2><span className="muted">Especie y trasfondo forman parte de la identidad del personaje.</span></div><div className="grid grid-2"><label className="field"><span>Especie</span><select value={data.race} onChange={e=>set({race:e.target.value})}><option value="">Seleccionar…</option>{SPECIES_OPTIONS.map(x=><option key={x}>{x}</option>)}</select></label><label className="field"><span>Trasfondo</span><select value={data.background} onChange={e=>set({background:e.target.value})}><option value="">Seleccionar…</option>{BACKGROUND_OPTIONS.map(x=><option key={x}>{x}</option>)}</select></label><label className="field"><span>Alineamiento</span><select value={data.alignment} onChange={e=>set({alignment:e.target.value})}><option value="">Seleccionar…</option>{ALIGNMENT_OPTIONS.map(x=><option key={x}>{x}</option>)}</select></label></div></>}
      {step===2 && <><div className="section-title"><h2>Características</h2><span className="muted">Método: {ABILITY_GENERATION_OPTIONS.find(x=>x.value===data.abilityMethod)?.label}</span></div><label className="field builder-method"><span>Método de generación</span><select value={data.abilityMethod} onChange={e=>set({abilityMethod:e.target.value})}>{ABILITY_GENERATION_OPTIONS.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}</select></label><div className="builder-stat-grid">{stats.map(([key,label])=><label className="builder-stat" key={key}><span>{label}</span><input type="number" min="1" max="30" value={data.stats[key]} onChange={e=>setStat(key,e.target.value)}/><b>{Math.floor((data.stats[key]-10)/2)>=0?'+':''}{Math.floor((data.stats[key]-10)/2)}</b></label>)}</div></>}
      {step===3 && <><div className="section-title"><h2>Detalles</h2><span className="muted">Estos datos aparecen en la cabecera de tu hoja.</span></div><div className="grid grid-2"><label className="field"><span>Nombre del personaje</span><input autoFocus value={data.name} onChange={e=>set({name:e.target.value})} placeholder="Ej. Arannis Valen"/></label><label className="field"><span>Nombre del jugador</span><input value={data.player} onChange={e=>set({player:e.target.value})} placeholder="Tu nombre"/></label><label className="field"><span>Nivel</span><input type="number" min="1" max="20" value={data.level} onChange={e=>set({level:Number(e.target.value)})}/></label></div></>}
      {step===4 && <><div className="section-title"><h2>Todo listo</h2><span className="muted">Revisa los datos antes de crear la hoja.</span></div><div className="builder-summary"><div className="summary-avatar">{(data.name || '?').slice(0,1).toUpperCase()}</div><div><h2>{data.name || 'Sin nombre'}</h2><p>{[data.race,data.class].filter(Boolean).join(' · ') || 'Sin origen configurado'}</p><p className="muted">Nivel {data.level} · {data.background || 'Sin trasfondo'}{data.alignment ? ` · ${data.alignment}` : ''}</p></div></div><div className="builder-summary-stats">{stats.map(([key,label])=><div key={key}><span>{label}</span><strong>{data.stats[key]}</strong></div>)}</div></>}
    </div>
    {error && <p className="error" role="alert">{error}</p>}
    <div className="builder-actions">{step>0?<button type="button" className="btn-secondary" disabled={creating} onClick={()=>{setError('');setStep(value=>value-1)}}>← Atrás</button>:<span/>}{step<STEPS.length-1?<button type="button" className="btn-primary" onClick={next}>Continuar →</button>:<button type="button" className="btn-primary" disabled={creating} onClick={finish}>{creating ? 'Creando personaje…' : 'Crear personaje'}</button>}</div>
  </section>;
}
