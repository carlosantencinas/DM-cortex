import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useCampaign } from '../context/useCampaign';

export default function DmDashboard(){
  const {campaignId,campaign,isDm}=useCampaign(); const [characters,setCharacters]=useState([]);
  useEffect(()=>{if(!campaignId)return;return onSnapshot(collection(db,'campaigns',campaignId,'characters'),snap=>setCharacters(snap.docs.map(d=>({id:d.id,...d.data()}))))},[campaignId]);
  if(!campaignId||!campaign)return <div className="dm-dashboard"><h2>Mesa del DM</h2><p className="muted">Crea una campaña desde Mi hoja para comenzar.</p></div>;
  if(!isDm)return <div className="dm-dashboard"><h2>Acceso de DM</h2><p>Este panel pertenece al DM de <strong>{campaign.name}</strong>.</p></div>;
  return <div className="dm-dashboard">
    <div className="page-title"><div><div className="eyebrow">Mesa de juego</div><h2>{campaign.name}</h2><p className="muted">{characters.length} personaje(s) conectados en tiempo real</p></div></div>
    <div className="invite-card"><div className="mini-label">Código de invitación</div><div className="invite-code">{campaign.inviteCode}</div><span className="muted">Comparte este código con tus jugadores.</span></div>
    <div className="party-grid">{characters.map(c=>{const hp=Math.max(0,Math.min(100,(c.hp?.actual/Math.max(1,c.hp?.max||1))*100));return <article key={c.id} className="party-card"><div className="eyebrow">Nivel {c.level||1}</div><h3>{c.name||'Personaje sin nombre'}</h3><p className="muted">{c.race||'—'} · {c.class||'—'}</p><strong>PV {c.hp?.actual??0} / {c.hp?.max??0}</strong><div className="hp-bar"><div className="hp-fill" style={{width:`${hp}%`}}/></div><div className="grid grid-2"><span><span className="mini-label">CA</span>{c.ac??'—'}</span><span><span className="mini-label">Iniciativa</span>{c.initiative??'—'}</span><span><span className="mini-label">Hechizos</span>{c.spells?.length||0}</span><span><span className="mini-label">Jugador</span>{c.player||'—'}</span></div></article>})}{characters.length===0&&<p className="muted">Ningún jugador se ha unido todavía.</p>}</div>
  </div>;
}
