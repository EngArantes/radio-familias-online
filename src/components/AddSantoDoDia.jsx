import React, { useState } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './AddSantoDoDia.css';

function SantoDoDia() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

    try {
      // Apagar os dados existentes
      const santoCollection = collection(db, 'SantoDoDia');
      const snapshot = await getDocs(santoCollection);
      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Upload da imagem para o Storage do Firebase
      const imageRef = ref(storage, `SantoDoDia/${imagem.name}`);
      await uploadBytes(imageRef, imagem);
      const imageUrl = await getDownloadURL(imageRef);

      // Salvar os novos dados no Firestore
      await addDoc(santoCollection, {
        nome,
        descricao,
        imagem: imageUrl,
        data: new Date(),
      });

      setNome('');
      setDescricao('');
      setImagem(null);
      setSuccess(true);
    } catch (error) {
      console.error('Erro ao salvar o Santo do Dia:', error);
      alert('Erro ao salvar os dados. Por favor, tente novamente.');
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
          <input type="file" id="imagem" accept="image/*" onChange={handleImageChange} />
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
