import React, { useState, useEffect } from 'react';
import { storage, db } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import './AddLeftRightBanners.css';

function AddLeftRightBanners({ bannerType }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  // Carregar a URL atual do banner ao montar o componente
  useEffect(() => {
    const fetchBanner = async () => {
      const docRef = doc(db, 'banners', bannerType);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setImageUrl(docSnap.data().imageUrl);
      }
    };

    fetchBanner();
  }, [bannerType]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
    } else {
      alert('Por favor, selecione um arquivo de imagem válido.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Por favor, selecione uma imagem.');
      return;
    }

    try {
      setUploading(true);

      // Se já existe um banner anterior, exclua-o do Storage
      if (imageUrl) {
        const previousRef = ref(storage, imageUrl);
        await deleteObject(previousRef);
        console.log('Banner anterior excluído com sucesso.');
      }

      // Fazer o upload do novo banner
      const storageRef = ref(storage, `banners/${bannerType}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progressPercent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progressPercent);
        },
        (error) => {
          console.error('Erro ao fazer upload:', error);
          alert('Erro ao fazer upload da imagem.');
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await setDoc(doc(db, 'banners', bannerType), {
            imageUrl: downloadURL,
          });

          setImageUrl(downloadURL);
          setFile(null);
          setProgress(0);
          setUploading(false);
          alert('Imagem carregada com sucesso!');
        }
      );
    } catch (error) {
      console.error('Erro ao processar o upload:', error);
      alert('Erro ao processar o upload.');
      setUploading(false);
    }
  };

  return (
    <div className="add-banner">
      <form onSubmit={handleUpload}>
        <div className="form-group">
          <label htmlFor="file">Selecione a imagem:</label>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" disabled={uploading}>
          {uploading ? 'Carregando...' : 'Enviar Imagem'}
        </button>
      </form>

      {uploading && (
        <div className="progress">
          <div
            className="progress-bar"
            style={{ width: `${progress}%`, backgroundColor: '#4caf50' }}
          >
            {progress}%
          </div>
        </div>
      )}

      {imageUrl && (
        <div className="image-preview">
          <h3>Prévia da Imagem Carregada:</h3>
          <img src={imageUrl} alt="Banner" style={{ width: '100%', maxHeight: '400px' }} />
        </div>
      )}
    </div>
  );
}

export default AddLeftRightBanners;
