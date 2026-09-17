import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

/*
  MODELO DE DATOS EN FIRESTORE
  =============================
  campaigns/{campaignId}
    - name: string
    - dmUid: string                (uid del DM, dueño de la campaña)
    - inviteCode: string           (código corto para que jugadores se unan)
    - createdAt: timestamp

  campaigns/{campaignId}/characters/{uid}
    - ownerUid: string             (jugador dueño de esta hoja)
    - name, class, level, race, stats, hp, spells, inventory, etc.
    - updatedAt: timestamp

  Con este modelo, el DM puede leer TODA la colección "characters" de su
  campaña (dashboard centralizado), y cada jugador solo puede escribir en
  su propio documento (characters/{su propio uid}).
*/
