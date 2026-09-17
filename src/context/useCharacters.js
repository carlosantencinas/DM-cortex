import { useCallback, useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const ACTIVE_KEY = 'dnd-cortex:activeCharacterId';

export function useCharacters() {
  const { user } = useAuth();
  const [characters, setCharacters] = useState([]);
  const [activeCharacterId, setActiveCharacterId] = useState(() => localStorage.getItem(ACTIVE_KEY));

  useEffect(() => {
    if (!user) {
      setCharacters([]);
      return undefined;
    }

    const ref = collection(db, 'users', user.uid, 'characters');
    return onSnapshot(ref, snapshot => {
      const items = snapshot.docs
        .map(item => ({ id: item.id, ...item.data() }))
        .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'es'));
      setCharacters(items);
    });
  }, [user]);

  const createCharacter = useCallback(async (seed = {}) => {
    if (!user) throw new Error('Debes iniciar sesión para crear un personaje.');
    const ref = doc(collection(db, 'users', user.uid, 'characters'));
    const character = {
      name: seed.name || 'Nuevo personaje',
      class: seed.class || '',
      level: Number(seed.level || 1),
      race: seed.race || '',
      background: seed.background || '',
      campaignId: seed.campaignId || null,
      ownerUid: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...seed,
    };
    await setDoc(ref, character);
    localStorage.setItem(ACTIVE_KEY, ref.id);
    setActiveCharacterId(ref.id);
    return ref.id;
  }, [user]);

  const updateCharacter = useCallback(async (characterId, data) => {
    if (!user || !characterId) return;
    await setDoc(doc(db, 'users', user.uid, 'characters', characterId), {
      ...data,
      ownerUid: user.uid,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }, [user]);

  const deleteCharacter = useCallback(async characterId => {
    if (!user || !characterId) return;
    await deleteDoc(doc(db, 'users', user.uid, 'characters', characterId));
    if (activeCharacterId === characterId) {
      localStorage.removeItem(ACTIVE_KEY);
      setActiveCharacterId(null);
    }
  }, [user, activeCharacterId]);

  const duplicateCharacter = useCallback(async character => {
    const copy = { ...character };
    delete copy.id;
    delete copy.createdAt;
    delete copy.updatedAt;
    copy.name = `${character.name || 'Personaje'} — copia`;
    return createCharacter(copy);
  }, [createCharacter]);

  const selectCharacter = useCallback(characterId => {
    if (!characterId) {
      localStorage.removeItem(ACTIVE_KEY);
      setActiveCharacterId(null);
      return;
    }
    localStorage.setItem(ACTIVE_KEY, characterId);
    setActiveCharacterId(characterId);
  }, []);

  return {
    characters,
    activeCharacterId,
    activeCharacter: characters.find(character => character.id === activeCharacterId) || null,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    duplicateCharacter,
    selectCharacter,
  };
}
