import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Para pegar o ID do evento na URL
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import './EventoDetalhes.css';

const EventoDetalhes = () => {
    const { id } = useParams(); // Obtem o ID do evento da URL
    const [evento, setEvento] = useState(null);

    useEffect(() => {
        const fetchEvento = async () => {
            const docRef = doc(db, 'eventos', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setEvento(docSnap.data());
            } else {
                console.error('Evento não encontrado!');
            }
        };

        fetchEvento();
    }, [id]);

    if (!evento) {
        return <p>Carregando evento...</p>;
    }

    return (
        <div className="evento-detalhes">
            <h1>{evento.nome}</h1>
            <p><strong>Data de Início:</strong> {new Date(evento.dataInicio).toLocaleString()}</p>
            <p><strong>Data de Fim:</strong> {new Date(evento.dataFim).toLocaleString()}</p>
            <p><strong>Local:</strong> {evento.local}</p>
            {evento.imagem && (
                <div className="evento-detalhes-image">
                    <img src={evento.imagem} alt={evento.nome} />
                </div>
            )}
            <p><strong>Descrição:</strong> {evento.descricao}</p>
        </div>
    );
};

export default EventoDetalhes;
