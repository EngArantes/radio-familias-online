import './BannerDireita.css';
import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';


function RightBanner() {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const docRef = doc(db, 'banners', 'rightBanner');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setImageUrl(docSnap.data().imageUrl);
        } else {
          console.warn('Nenhum banner encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar o banner direito:', error);
      }
    };

    fetchBanner();
  }, []);

  return (
    <div className="sidebar right">
      {imageUrl ? (
        <img src={imageUrl} alt="Publicidade 2" className="advertisement" />
      ) : (
        <p>Carregando banner...</p>
      )}
    </div>
  );
}

export default RightBanner;
