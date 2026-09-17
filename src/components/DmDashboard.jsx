import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useCampaign } from '../context/useCampaign';

export default function DmDashboard() {
  const { campaignId, campaign, isDm } = useCampaign();
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    if (!campaignId) return;
    const unsub = onSnapshot(collection(db, 'campaigns', campaignId, 'characters'), (snap) => {
      setCharacters(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [campaignId]);

  if (!campaignId || !campaign) {
    return <p>Todavía no estás en ninguna campaña. Andá a "Mi hoja" para crear una.</p>;
  }

  if (!isDm) {
    return <p>Este panel es solo para el DM de la campaña <strong>{campaign.name}</strong>.</p>;
  }

  return (
    <div className="dm-dashboard">
      <h2>Panel del DM — {campaign.name}</h2>
      <p>Código de invitación para tus jugadores: <code>{campaign.inviteCode}</code></p>

      <div className="party-grid">
        {characters.map((c) => (
          <article key={c.id} className="party-card">
            <h3>{c.name || 'Personaje sin nombre'}</h3>
            <p>{c.race} {c.class} · Nivel {c.level}</p>
            <p>PV: {c.hp?.actual} / {c.hp?.max}</p>
            <p>Hechizos preparados: {c.spells?.length || 0}</p>
          </article>
        ))}
        {characters.length === 0 && <p>Ningún jugador se unió todavía con el código de invitación.</p>}
      </div>
    </div>
  );
}
