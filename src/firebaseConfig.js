import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Importando o Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyB6M8Q03fR0EwD_2WRR646x91Nkt13jkMg",
  authDomain: "pequi-agenda.firebaseapp.com",
  projectId: "pequi-agenda",
  storageBucket: "pequi-agenda.appspot.com",
  messagingSenderId: "424206656807",
  appId: "1:424206656807:web:3d3487e0253090f930f502"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // Inicializando e exportando o Storage

// Habilita persistência offline para Firestore
/* enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.error('Persistência offline falhou devido a múltiplas abas abertas.');
  } else if (err.code === 'unimplemented') {
    console.error('Persistência offline não é suportada no navegador.');
  }
}); */

