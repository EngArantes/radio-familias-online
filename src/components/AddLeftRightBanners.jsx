import React, { useState, useEffect, useRef } from 'react';
import { storage, db } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import './AddLeftRightBanners.css';

function AddLeftRightBanners({ bannerType }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef(null);

  // ID único por banner: evita que o <label> abra o input de OUTRO formulário
  // (todos usavam id="file" e o navegador apontava sempre para o primeiro).
  const inputId = `file-${bannerType}`;

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
      e.target.value = '';
      alert('Por favor, selecione um arquivo de imagem válido.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Por favor, selecione uma imagem.');
      return;
    }

    // Guarda a URL atual ANTES de enviar para excluir depois do upload com sucesso
    const previousImageUrl = imageUrl;

    try {
      setUploading(true);
      setProgress(0);

      // Nome único (timestamp + nome original) para evitar colisão/cache de URL
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

      // Fazer o upload do novo banner
      const storageRef = ref(storage, `banners/${bannerType}/${fileName}`);
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
          alert(`Erro ao fazer upload da imagem: ${error.message}`);
          setUploading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await setDoc(doc(db, 'banners', bannerType), {
              imageUrl: downloadURL,
            });

            // A imagem antiga só é excluída DEPOIS que a nova já está salva.
            // Se a exclusão falhar, apenas avisamos no console (não quebra o envio).
            if (previousImageUrl && previousImageUrl !== downloadURL) {
              try {
                // Extrai o caminho do arquivo a partir da URL de download
                // (mais confiável que passar a URL completa para ref()).
                const caminhoAntigo = decodeURIComponent(
                  previousImageUrl.split('/o/')[1]?.split('?')[0] ?? ''
                );
                if (caminhoAntigo) {
                  await deleteObject(ref(storage, caminhoAntigo));
                  console.log('Banner anterior excluído com sucesso.');
                } else {
                  console.warn(
                    'Não foi possível identificar o arquivo do banner anterior:',
                    previousImageUrl
                  );
                }
              } catch (deleteError) {
                console.warn(
                  'Não foi possível excluir o banner anterior:',
                  deleteError.message
                );
              }
            }

            setImageUrl(downloadURL);
            setFile(null);
            setProgress(0);
            if (fileInputRef.current) {
              fileInputRef.current.value = ''; // permite reenviar o mesmo arquivo
            }
            alert('Imagem carregada com sucesso!');
          } catch (error) {
            console.error('Erro ao salvar o banner:', error);
            alert(`Erro ao salvar o banner: ${error.message}`);
          } finally {
            setUploading(false);
          }
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
          <label htmlFor={inputId}>Selecione a imagem:</label>
          <input
            type="file"
            id={inputId}
            ref={fileInputRef}
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
