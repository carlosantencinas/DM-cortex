import { useCallback, useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDoc, onSnapshot, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const ACTIVE_KEY = 'dnd-cortex:activeCharacterId';

function blankCharacter(user, seed = {}) {
  return {
    name: 'Nuevo personaje', player: user.displayName || '', class: '', subclass: '', level: 1,
    race: '', background: '', alignment: '', size: 'Mediano', xp: 0, proficiencyBonus: 2,
    speed: 9, ac: 10, initiative: 0, passivePerception: 10,
    stats: { for: 10, des: 10, con: 10, int: 10, sab: 10, car: 10 },
    savingThrows: {}, skills: {},
    hp: { actual: 10, max: 10, temp: 0 }, hitDice: '1d10',
    spells: [], inventory: '', attacks: [], features: '', personality: '', ideals: '', bonds: '', flaws: '',
    languages: 'Común', proficiencies: '', notes: '', campaignId: null,
    ownerUid: user.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp(), ...seed,
  };
}

export function useCharacters() {
  const { user } = useAuth();
  const [characters, setCharacters] = useState([]);
  const [activeCharacterId, setActiveCharacterId] = useState(() => localStorage.getItem(ACTIVE_KEY));

  useEffect(() => {
    if (!user) { setCharacters([]); return undefined; }
    return onSnapshot(collection(db, 'users', user.uid, 'characters'), snapshot => {
      setCharacters(snapshot.docs.map(item => ({ id: item.id, ...item.data() }))
        .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'es')));
    }, () => setCharacters([]));
  }, [user]);

  const syncCampaignCharacter = useCallback(async (characterId, data) => {
    if (!user || !characterId || !data?.campaignId) return;
    await setDoc(doc(db, 'campaigns', data.campaignId, 'characters', characterId), {
      ...data, ownerUid: user.uid, campaignId: data.campaignId, characterId, updatedAt: serverTimestamp(),
    }, { merge: true });
  }, [user]);

  const createCharacter = useCallback(async (seed = {}) => {
    if (!user) throw new Error('Debes iniciar sesión para crear un personaje.');
    const ref = doc(collection(db, 'users', user.uid, 'characters'));
    const write = setDoc(ref, blankCharacter(user, seed));
    await Promise.race([write, new Promise((_, reject) => setTimeout(() => { const error = new Error('La creación está tardando demasiado. Comprueba tu conexión con Firebase e inténtalo de nuevo.'); error.code = 'dm-cortex/write-timeout'; reject(error); }, 15000))]);
    if (character.campaignId) await syncCampaignCharacter(ref.id, character);
    localStorage.setItem(ACTIVE_KEY, ref.id);
    setActiveCharacterId(ref.id);
    return ref.id;
  }, [user, syncCampaignCharacter]);

  const updateCharacter = useCallback(async (characterId, data) => {
    if (!user || !characterId) return;
    const current = await getDoc(doc(db, 'users', user.uid, 'characters', characterId));
    const merged = { ...(current.exists() ? current.data() : {}), ...data };
    await setDoc(doc(db, 'users', user.uid, 'characters', characterId), { ...data, ownerUid: user.uid, updatedAt: serverTimestamp() }, { merge: true });
    if (merged.campaignId) await syncCampaignCharacter(characterId, merged);
  }, [user]);

  const deleteCharacter = useCallback(async characterId => {
    if (!user || !characterId) return;
    const userRef = doc(db, 'users', user.uid, 'characters', characterId);
    const current = await getDoc(userRef);
    const campaignId = current.exists() ? current.data().campaignId : null;
    const batch = writeBatch(db);
    batch.delete(userRef);
    if (campaignId) batch.delete(doc(db, 'campaigns', campaignId, 'characters', characterId));
    await batch.commit();
    if (activeCharacterId === characterId) { localStorage.removeItem(ACTIVE_KEY); setActiveCharacterId(null); }
  }, [user, activeCharacterId]);

  const duplicateCharacter = useCallback(async character => {
    const copy = { ...character }; delete copy.id; delete copy.createdAt; delete copy.updatedAt;
    copy.name = `${character.name || 'Personaje'} — copia`;
    return createCharacter(copy);
  }, [createCharacter]);

  const selectCharacter = useCallback(characterId => {
    if (!characterId) { localStorage.removeItem(ACTIVE_KEY); setActiveCharacterId(null); return; }
    localStorage.setItem(ACTIVE_KEY, characterId); setActiveCharacterId(characterId);
  }, []);

  return { characters, activeCharacterId, activeCharacter: characters.find(c => c.id === activeCharacterId) || null, createCharacter, updateCharacter, deleteCharacter, duplicateCharacter, selectCharacter };
}
