import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useCampaign } from '../context/useCampaign';
import SpellPicker from './SpellPicker.jsx';

const BLANK_CHARACTER = {
  name: '', class: '', level: 1, race: '',
  stats: { for: 10, des: 10, con: 10, int: 10, sab: 10, car: 10 },
  hp: { actual: 10, max: 10 },
  spells: [], // array de nombres/índices de hechizo elegidos
  inventory: '',
};

export default function CharacterSheet() {
  const { user } = useAuth();
  const { campaignId, campaign, createCampaign, joinCampaignByCode } = useCampaign();
  const [character, setCharacter] = useState(BLANK_CHARACTER);
  const [joinCode, setJoinCode] = useState('');
  const [newCampaignName, setNewCampaignName] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!campaignId || !user) return;
    const ref = doc(db, 'campaigns', campaignId, 'characters', user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setCharacter({ ...BLANK_CHARACTER, ...snap.data() });
    });
    return unsub;
  }, [campaignId, user]);

  async function save(next) {
    setCharacter(next);
    if (!campaignId || !user) return;
    const ref = doc(db, 'campaigns', campaignId, 'characters', user.uid);
    await setDoc(ref, { ...next, ownerUid: user.uid, updatedAt: serverTimestamp() }, { merge: true });
  }

  if (!campaignId) {
    return (
      <div className="onboarding">
        <h2>Unite a una campaña</h2>
        <p>Pedile a tu DM el código de invitación, o creá una campaña nueva si vos sos el DM.</p>
        <div className="onboarding-row">
          <input placeholder="Código de invitación" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} />
          <button className="btn-primary" onClick={async () => {
            try { await joinCampaignByCode(joinCode); }
            catch (e) { setStatus(e.message); }
          }}>Unirme</button>
        </div>
        <hr />
        <div className="onboarding-row">
          <input placeholder="Nombre de campaña nueva" value={newCampaignName} onChange={(e) => setNewCampaignName(e.target.value)} />
          <button className="btn-secondary" onClick={() => createCampaign(newCampaignName)}>Crear campaña (soy el DM)</button>
        </div>
        {status && <p className="error">{status}</p>}
      </div>
    );
  }

  return (
    <div className="character-sheet">
      {campaign && (
        <p className="campaign-badge">
          Campaña: <strong>{campaign.name}</strong> · Código para invitar: <code>{campaign.inviteCode}</code>
        </p>
      )}

      <section className="sheet-header">
        <input placeholder="Nombre del personaje" value={character.name}
          onChange={(e) => save({ ...character, name: e.target.value })} />
        <input placeholder="Clase" value={character.class}
          onChange={(e) => save({ ...character, class: e.target.value })} />
        <input placeholder="Raza / Especie" value={character.race}
          onChange={(e) => save({ ...character, race: e.target.value })} />
        <input type="number" min="1" max="20" value={character.level}
          onChange={(e) => save({ ...character, level: Number(e.target.value) })} />
      </section>

      <section className="sheet-stats">
        {Object.entries(character.stats).map(([key, value]) => (
          <label key={key} className="stat-box">
            <span>{key.toUpperCase()}</span>
            <input type="number" value={value}
              onChange={(e) => save({ ...character, stats: { ...character.stats, [key]: Number(e.target.value) } })} />
          </label>
        ))}
      </section>

      <section className="sheet-hp">
        <label>PV actuales
          <input type="number" value={character.hp.actual}
            onChange={(e) => save({ ...character, hp: { ...character.hp, actual: Number(e.target.value) } })} />
        </label>
        <label>PV máximos
          <input type="number" value={character.hp.max}
            onChange={(e) => save({ ...character, hp: { ...character.hp, max: Number(e.target.value) } })} />
        </label>
      </section>

      <section className="sheet-spells">
        <h3>Hechizos</h3>
        <SpellPicker
          selected={character.spells}
          onChange={(spells) => save({ ...character, spells })}
        />
      </section>

      <section className="sheet-inventory">
        <h3>Inventario</h3>
        <textarea value={character.inventory} rows={6}
          onChange={(e) => save({ ...character, inventory: e.target.value })} />
      </section>
    </div>
  );
}
