import { useEffect, useState, useCallback } from 'react';
import {
  collection, doc, getDoc, setDoc, deleteDoc, serverTimestamp,
  onSnapshot, writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const LS_KEY = 'dnd-tracker:campaignId';
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomCode(length = 8) {
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, value => CODE_CHARS[value % CODE_CHARS.length]).join('');
}

async function uniqueInviteCode() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = randomCode();
    const existing = await getDoc(doc(db, 'campaignInvites', code));
    if (!existing.exists()) return code;
  }
  throw new Error('No se pudo generar un código de invitación único. Intenta nuevamente.');
}

export function useCampaign() {
  const { user } = useAuth();
  const [campaignId, setCampaignId] = useState(() => localStorage.getItem(LS_KEY));
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    if (!campaignId || !user) {
      setCampaign(null);
      return undefined;
    }

    const campaignRef = doc(db, 'campaigns', campaignId);
    return onSnapshot(campaignRef, snap => {
      setCampaign(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    }, () => setCampaign(null));
  }, [campaignId, user]);

  const createCampaign = useCallback(async (name, options = {}) => {
    if (!user) throw new Error('Debes iniciar sesión para crear una campaña.');
    const cleanName = String(name || '').trim();
    if (!cleanName) throw new Error('Escribe un nombre para la campaña.');

    const inviteCode = await uniqueInviteCode();
    const campaignRef = doc(collection(db, 'campaigns'));
    const memberRef = doc(db, 'campaigns', campaignRef.id, 'members', user.uid);
    const inviteRef = doc(db, 'campaignInvites', inviteCode);
    const batch = writeBatch(db);

    batch.set(campaignRef, {
      name: cleanName,
      description: String(options.description || '').trim(),
      system: options.system || 'D&D 2024',
      maxPlayers: Number(options.maxPlayers || 8),
      status: 'active',
      dmUid: user.uid,
      inviteCode,
      createdAt: serverTimestamp(),
    });
    batch.set(memberRef, {
      uid: user.uid,
      role: 'dm',
      displayName: user.displayName || '',
      email: user.email || '',
      joinedAt: serverTimestamp(),
    });
    batch.set(inviteRef, {
      campaignId: campaignRef.id,
      status: 'active',
      createdAt: serverTimestamp(),
    });
    await batch.commit();

    localStorage.setItem(LS_KEY, campaignRef.id);
    setCampaignId(campaignRef.id);
    return campaignRef.id;
  }, [user]);

  const joinCampaignByCode = useCallback(async code => {
    if (!user) throw new Error('Debes iniciar sesión para unirte a una campaña.');
    const normalized = String(code || '').trim().toUpperCase();
    if (!normalized) throw new Error('Introduce el código de invitación.');

    const inviteSnap = await getDoc(doc(db, 'campaignInvites', normalized));
    if (!inviteSnap.exists() || inviteSnap.data().status !== 'active') {
      throw new Error('No se encontró una invitación activa con ese código.');
    }

    const { campaignId: targetId } = inviteSnap.data();
    const campaignSnap = await getDoc(doc(db, 'campaigns', targetId));
    if (!campaignSnap.exists() || campaignSnap.data().status !== 'active') {
      throw new Error('La campaña ya no está activa.');
    }

    const campaignData = campaignSnap.data();
    const memberRef = doc(db, 'campaigns', targetId, 'members', user.uid);
    const memberSnap = await getDoc(memberRef);
    if (!memberSnap.exists()) {
      const batch = writeBatch(db);
      batch.set(memberRef, {
        uid: user.uid,
        role: 'player',
        displayName: user.displayName || '',
        email: user.email || '',
        inviteCodeUsed: normalized,
        joinedAt: serverTimestamp(),
      });
      await batch.commit();
    }

    localStorage.setItem(LS_KEY, targetId);
    setCampaignId(targetId);
    return targetId;
  }, [user]);

  const leaveCampaign = useCallback(async () => {
    if (user && campaignId && campaign?.dmUid !== user.uid) {
      await deleteDoc(doc(db, 'campaigns', campaignId, 'members', user.uid));
    }
    localStorage.removeItem(LS_KEY);
    setCampaignId(null);
    setCampaign(null);
  }, [user, campaignId, campaign]);

  const isDm = Boolean(user && campaign && campaign.dmUid === user.uid);

  return {
    campaignId,
    campaign,
    isDm,
    createCampaign,
    joinCampaignByCode,
    leaveCampaign,
  };
}
