import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Importando o Firestore
import { doc, getDoc } from 'firebase/firestore';
import './BannerPrincipal'

const BannerPrincipal = () => {
  const [bannerImage, setBannerImage] = useState(null);

  useEffect(() => {
    const fetchBannerImage = async () => {
      const bannerDocRef = doc(db, 'banners', 'bannerPrincipal'); // 'banners' é a coleção e 'bannerPrincipal' é o documento
      const bannerDoc = await getDoc(bannerDocRef);

      if (bannerDoc.exists()) {
        setBannerImage(bannerDoc.data().imageUrl); // Supondo que a imagem esteja armazenada em 'imageUrl'
      } else {
        console.log('Nenhum banner encontrado!');
      }
    };

    fetchBannerImage();
  }, []);

  return (
    <div className="banner-principal">
      {bannerImage ? (
        <img src={bannerImage} alt="Banner Principal" className="banner-image" />
      ) : (
        <p>Carregando o banner...</p>
      )}
    </div>
  );
};

export default BannerPrincipal;
