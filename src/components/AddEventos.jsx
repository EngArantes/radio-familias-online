import React, { useState } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import './AddEventos.css';

const AddEventos = () => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [imagem, setImagem] = useState(null);
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [local, setLocal] = useState('');
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImagem(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = '';

            // Se houver imagem, faça o upload
            if (imagem) {
                const imageRef = storageRef(storage, `eventos/${imagem.name}`);
                await uploadBytes(imageRef, imagem);
                imageUrl = await getDownloadURL(imageRef);
            }

            // Adicionando o evento ao Firestore
            const eventoRef = collection(db, 'eventos');
            const docRef = await addDoc(eventoRef, {
                nome,
                descricao,
                imagem: imageUrl,
                dataInicio,
                dataFim,
                local,
                createdAt: new Date().toISOString(),
            });

            console.log('Evento adicionado com ID:', docRef.id);

            // Agendando a exclusão do evento após duas semanas do fim
            const dataFimDate = new Date(dataFim);
            const deleteAfterTwoWeeks = dataFimDate.getTime() + 14 * 24 * 60 * 60 * 1000; // 14 dias em milissegundos

            setTimeout(async () => {
                try {
                    await deleteDoc(doc(db, 'eventos', docRef.id));
                    console.log('Evento excluído após 2 semanas.');
                } catch (deleteError) {
                    console.error('Erro ao excluir evento:', deleteError);
                }
            }, deleteAfterTwoWeeks - Date.now());

            // Resetando o formulário após o envio
            setNome('');
            setDescricao('');
            setImagem(null);
            setImagePreview('');
            setDataInicio('');
            setDataFim('');
            setLocal('');
        } catch (error) {
            console.error('Erro ao adicionar evento:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-evento-container">
            <form onSubmit={handleSubmit} className="add-evento-form">
                <input
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome do Evento"
                    required
                />
                
                <label className='label-datas'>Data e Horário de início</label>
                <input
                    type="datetime-local"
                    id="dataInicio"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    required
                />
                <label className='label-datas'>Data e Horário Fim</label>
                <input
                    type="datetime-local"
                    id="dataFim"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    required
                />
                <input
                    type="text"
                    id="local"
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    placeholder="Local do Evento"
                    required
                />
                <textarea
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descrição do Evento"
                    required
                />
                <input
                    type="file"
                    onChange={handleFileChange}
                />
                {imagePreview && (
                    <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                    </div>
                )}
                <button type="submit" disabled={loading}>Adicionar Evento</button>
            </form>
        </div>
    );
};

export default AddEventos;
