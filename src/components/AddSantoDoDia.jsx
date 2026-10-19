import React, { useState, useRef } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import './AddSantoDoDia.css';

function SantoDoDia() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImagem(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !descricao || !imagem) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const santoCollection = collection(db, 'SantoDoDia');

      // Guarda os documentos antigos (com a URL da imagem) ANTES de subir o novo.
      // A exclusão só acontece DEPOIS que o novo já está salvo.
      const snapshot = await getDocs(santoCollection);
      const docsAntigos = snapshot.docs.map((d) => ({
        ref: d.ref,
        imagemUrl: d.data()?.imagem,
      }));

      // Nome único (timestamp + nome original) para evitar colisão/cache de URL
      const fileName = `${Date.now()}_${imagem.name.replace(/\s+/g, '_')}`;

      // Upload da imagem para o Storage do Firebase
      const imageRef = ref(storage, `SantoDoDia/${fileName}`);
      await uploadBytes(imageRef, imagem);
      const imageUrl = await getDownloadURL(imageRef);

      // Salvar os novos dados no Firestore
      await addDoc(santoCollection, {
        nome,
        descricao,
        imagem: imageUrl,
        data: new Date(),
      });

      // Apagar os documentos antigos do Firestore (melhor esforço)
      for (const antigo of docsAntigos) {
        try {
          await deleteDoc(antigo.ref);
        } catch (deleteError) {
          console.warn(
            'Não foi possível excluir o documento antigo do Santo do Dia:',
            deleteError.message
          );
        }
      }

      // Apagar as imagens antigas do Storage (melhor esforço: falha não quebra o envio)
      for (const antigo of docsAntigos) {
        if (!antigo.imagemUrl || antigo.imagemUrl === imageUrl) continue;
        try {
          await deleteObject(ref(storage, antigo.imagemUrl));
          console.log('Imagem antiga do Santo do Dia excluída do Storage.');
        } catch (deleteError) {
          console.warn(
            'Não foi possível excluir a imagem antiga do Storage:',
            deleteError.message
          );
        }
      }

      setNome('');
      setDescricao('');
      setImagem(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // permite reenviar o mesmo arquivo
      }
      setSuccess(true);
    } catch (error) {
      console.error('Erro ao salvar o Santo do Dia:', error);
      alert(`Erro ao salvar os dados: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="santo-do-dia">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome do santo"
          />
        </div>
        <div className="form-group">
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Digite a descrição do santo"
            rows="5"
          />
        </div>
        <div className="form-group">
          <input type="file" id="imagem" accept="image/*" ref={fileInputRef} onChange={handleImageChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
      {success && <p>Dados salvos com sucesso!</p>}
    </div>
  );
}

export default SantoDoDia;
