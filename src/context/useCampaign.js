import { useEffect, useState, useCallback } from 'react';
import {
  collection, doc, getDocs, query, where,
  setDoc, serverTimestamp, onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

// Guardamos en localStorage a qué campaña pertenece este usuario para no
// tener que pedirle el código cada vez que entra (esto es solo una
// conveniencia local, el dato real vive en Firestore).
const LS_KEY = 'dnd-tracker:campaignId';

function randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function useCampaign() {
  const { user } = useAuth();
  const [campaignId, setCampaignId] = useState(() => localStorage.getItem(LS_KEY));
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    if (!campaignId) return;
    const unsub = onSnapshot(doc(db, 'campaigns', campaignId), (snap) => {
      setCampaign(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    });
    return unsub;
  }, [campaignId]);

  const createCampaign = useCallback(async (name) => {
    if (!user) return;
    const inviteCode = randomCode();
    const ref = doc(collection(db, 'campaigns'));
    await setDoc(ref, {
      name,
      dmUid: user.uid,
      inviteCode,
      createdAt: serverTimestamp(),
    });
    localStorage.setItem(LS_KEY, ref.id);
    setCampaignId(ref.id);
    return ref.id;
  }, [user]);

  const joinCampaignByCode = useCallback(async (code) => {
    const q = query(collection(db, 'campaigns'), where('inviteCode', '==', code.toUpperCase()));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error('No se encontró ninguna campaña con ese código.');
    const found = snap.docs[0];
    localStorage.setItem(LS_KEY, found.id);
    setCampaignId(found.id);
    return found.id;
  }, []);

  const isDm = !!(user && campaign && campaign.dmUid === user.uid);

  return { campaignId, campaign, isDm, createCampaign, joinCampaignByCode };
}
