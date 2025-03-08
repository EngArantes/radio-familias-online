import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'; // Importando funções específicas do Firestore
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

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
export const storage = getStorage(app);

// Exportando as funções necessárias
export const getPlayerState = async () => {
  try {
    const docRef = doc(db, "configurations", "settings"); // Acessa o documento 'settings'
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().player_active;
    } else {
      console.log("Nenhuma configuração encontrada.");
      return true; // Se não encontrar, assume que o player está ativado por padrão
    }
  } catch (error) {
    console.error("Erro ao buscar estado do player: ", error);
    return true; // Retorna true caso haja erro na consulta
  }
};

export const updatePlayerState = async (isActive) => {
  try {
    const docRef = doc(db, "configurations", "settings");
    await setDoc(docRef, { player_active: isActive });
    console.log("Estado do player atualizado com sucesso");
  } catch (error) {
    console.error("Erro ao atualizar o estado do player: ", error);
  }
};

