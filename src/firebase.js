import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Firestore normally uses a WebChannel connection. Some browsers, extensions,
// corporate networks and proxies close that connection (ERR_CONNECTION_CLOSED),
// after which Firestore reports "the client is offline" even though the browser
// itself still has internet access. Auto-detecting long polling makes the client
// fall back to a more compatible HTTP transport when WebChannel is unavailable.
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});

export const googleProvider = new GoogleAuthProvider();

/*
  MODELO DE DATOS EN FIRESTORE
  =============================
  users/{userId}/characters/{characterId}
    - ownerUid: string
    - name, class, level, race, stats, hp, spells, inventory, etc.
    - campaignId: string|null
    - updatedAt: timestamp

  campaigns/{campaignId}/characters/{characterId}
    - ownerUid: string
    - name, class, level, race, stats, hp, spells, inventory, etc.
    - updatedAt: timestamp

  El personaje canónico pertenece al jugador y la colección de campaña sirve
  como roster compartido para que el DM pueda verlo.
*/
