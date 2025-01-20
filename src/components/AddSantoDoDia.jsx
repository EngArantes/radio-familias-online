import React, { useState } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
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
      // Upload da imagem para o Storage do Firebase
      const imageRef = ref(storage, `SantoDoDia/${imagem.name}`);
      await uploadBytes(imageRef, imagem);
      const imageUrl = await getDownloadURL(imageRef);

      // Salvar os dados no Firestore
      const santoCollection = collection(db, 'SantoDoDia');
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
          <label htmlFor="nome">Nome do Santo:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome do santo"
          />
        </div>
        <div className="form-group">
          <label htmlFor="descricao">Descrição:</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Digite a descrição do santo"
            rows="5"
          />
        </div>
        <div className="form-group">
          <label htmlFor="imagem">Imagem do Santo:</label>
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
