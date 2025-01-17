import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import './BannerEsquerda.css';

function LeftBanner() {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const docRef = doc(db, 'banners', 'leftBanner');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setImageUrl(docSnap.data().imageUrl);
        } else {
          console.warn('Nenhum banner encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar o banner esquerdo:', error);
      }
    };

    fetchBanner();
  }, []);

  return (
    <div className="sidebar left">
      {imageUrl ? (
        <img src={imageUrl} alt="Publicidade 1" className="advertisement" />
      ) : (
        <p>Carregando banner...</p>
      )}
    </div>
  );
}

export default LeftBanner;
