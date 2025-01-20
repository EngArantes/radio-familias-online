import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './SantoDoDia.css';

function SantoDoDiaDisplay() {
  const [santos, setSantos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSantos = async () => {
      try {
        const santoCollection = collection(db, 'SantoDoDia');
        const snapshot = await getDocs(santoCollection);

        const santosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSantos(santosData);
      } catch (error) {
        console.error('Erro ao recuperar os dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSantos();
  }, []);

  return (
    <div className="santo-do-dia-display">
      {loading ? (
        <p>Carregando dados...</p>
      ) : (
        santos.map((santo) => (
          <div className="santo-details" key={santo.id}>
            <h1>Santo do dia</h1>
            <h3>{santo.nome}</h3>
            {santo.imagem && <img src={santo.imagem} alt={santo.nome} />}
            <p className='textoSanto'>{santo.descricao}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default SantoDoDiaDisplay;
