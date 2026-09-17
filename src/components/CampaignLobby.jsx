import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { useCampaign } from '../context/useCampaign';

export default function CampaignLobby() {
  const { campaign, campaignId, isDm, createCampaign, joinCampaignByCode, leaveCampaign } = useCampaign();
  const [name, setName] = useState('Mi campaña');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!campaignId) return undefined;
    return onSnapshot(collection(db, 'campaigns', campaignId, 'members'), snap => setPlayers(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [campaignId]);

  if (campaign) return <section className="campaign-lobby section">
    <div className="lobby-header"><div><div className="eyebrow">{isDm ? 'PANEL DEL DM' : 'CAMPAÑA'}</div><h2>{campaign.name}</h2><p className="muted">{campaign.description || 'Campaña D&D 2024'}</p></div><button className="btn-secondary" onClick={leaveCampaign}>Cambiar campaña</button></div>
    <div className="invite-panel"><div><span className="mini-label">CÓDIGO DE INVITACIÓN</span><strong>{campaign.inviteCode}</strong><p className="muted">Comparte este código con tus jugadores para que se unan.</p></div><button className="btn-primary" onClick={()=>navigator.clipboard?.writeText(campaign.inviteCode)}>Copiar código</button></div>
    <div className="lobby-stats"><div><strong>{players.length}</strong><span>miembros</span></div><div><strong>{campaign.maxPlayers || 8}</strong><span>máximo</span></div><div><strong>{isDm ? 'DM' : 'Jugador'}</strong><span>tu rol</span></div></div>
    <div className="section"><div className="section-title"><h3>Grupo</h3><span className="muted">Actualización en tiempo real</span></div><div className="member-list">{players.map(p=><div className="member-row" key={p.id}><div className="member-avatar">{(p.displayName || p.email || '?').slice(0,1).toUpperCase()}</div><div><strong>{p.displayName || 'Jugador'}</strong><span>{p.role === 'dm' ? 'Dungeon Master' : 'Jugador'}</span></div>{p.id === campaign.dmUid && <b className="role-badge">DM</b>}</div>)}</div></div>
    <Link className="btn-primary" to="/personajes">Ir a mis personajes</Link>
  </section>;

  return <section className="campaign-lobby section"><div className="eyebrow">DM CORTEX</div><h2>Tu mesa de juego</h2><p className="muted">Crea una campaña como DM o introduce el código que te dio tu Dungeon Master.</p><div className="lobby-columns"><div className="section"><h3>Crear campaña</h3><label className="field"><span>Nombre</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="La Mina Perdida"/></label><label className="field"><span>Descripción</span><textarea rows="3" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Una breve descripción de la aventura"/></label><button className="btn-primary full" onClick={async()=>{try{setError('');await createCampaign(name,{description,maxPlayers:8})}catch(e){setError(e.message)}}}>⚔ Crear campaña como DM</button></div><div className="section"><h3>Unirme a una campaña</h3><label className="field"><span>Código de invitación</span><input value={code} maxLength="8" onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="ABCD2345"/></label><button className="btn-secondary full" onClick={async()=>{try{setError('');await joinCampaignByCode(code)}catch(e){setError(e.message)}}}>🎲 Unirme</button></div></div>{error&&<p className="error">{error}</p>}</section>;
}
