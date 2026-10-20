import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Para pegar o ID do evento na URL
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import Seo from '../components/Seo';
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
            <Seo
                title={evento.nome}
                description={(evento.descricao || `Detalhes do evento ${evento.nome} da Rádio Famílias Online.`).slice(0, 155)}
                path={`/eventos/${id}`}
                image={evento.imagem || undefined}
            />
            {evento.imagem && evento.dataInicio && (
                <Helmet>
                    <script type="application/ld+json">
                        {JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Event',
                            name: evento.nome,
                            description: evento.descricao,
                            startDate: new Date(evento.dataInicio).toISOString(),
                            endDate: evento.dataFim ? new Date(evento.dataFim).toISOString() : undefined,
                            location: evento.local,
                            image: evento.imagem || undefined,
                            url: `https://radiofamiliasonline.com/eventos/${id}`,
                        })}
                    </script>
                </Helmet>
            )}
            <h1>{evento.nome}</h1>
            <p><strong>Data de Início:</strong> {new Date(evento.dataInicio).toLocaleDateString()}</p>
            <p><strong>Horário de Início:</strong> {new Date(evento.dataInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p><strong>Data de Fim:</strong> {new Date(evento.dataFim).toLocaleDateString()}</p>
            <p><strong>Horário de Fim:</strong> {new Date(evento.dataFim).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
