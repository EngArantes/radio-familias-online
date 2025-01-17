import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import './VideosDestaque.css';

const VideosDestaque = () => {
  const [featuredVideos, setFeaturedVideos] = useState([]);

  useEffect(() => {
    const fetchFeaturedVideos = async () => {
      try {
        const featuredVideosCollection = collection(db, "VideosDestaque");
        const videoSnapshot = await getDocs(featuredVideosCollection);
        const videoList = videoSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFeaturedVideos(videoList);
      } catch (error) {
        console.error("Erro ao buscar os vídeos destacados:", error);
      }
    };

    fetchFeaturedVideos();
  }, []);

  return (
    <div className="videos-destaque">
      <div className="video-grid">
        {featuredVideos.length === 0 ? (
          <p>Não há vídeos em destaque no momento.</p>
        ) : (
          featuredVideos.map((video) => (
            <div key={video.id} className="video-card">
              <iframe
                src={video.link.replace("watch?v=", "embed/")}
                title={`Video ${video.id}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <p className="video-title">{video.title || "Sem título"}</p> {/* Exibe o título do vídeo */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VideosDestaque;
