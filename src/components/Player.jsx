import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import './Player.css';

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const streamUrl =
    "https://stream-176.zeno.fm/mvwnqucijectv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJtdnducXVjaWplY3R2IiwiaG9zdCI6InN0cmVhbS0xNzYuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6IjZfWjJwMUdRU1BLU3pYUTljS0VEU1EiLCJpYXQiOjE3MzY4ODQxMDUsImV4cCI6MTczNjg4NDE2NX0.5oqGrzKilfMQW4HWxUr1ARJPhFVu7bpsRzSMO-m7src";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Define o volume inicial

      // Tenta reproduzir o áudio automaticamente
      const playAudio = async () => {
        try {
          await audioRef.current.play();
          setIsPlaying(true); // Atualiza o estado para indicar que está tocando
        } catch (error) {
          console.warn(
            "Autoplay bloqueado pelo navegador. O usuário precisa interagir com a página.",
            error
          );
        }
      };

      playAudio();
    }
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="playerPrincipal">
      <div className="playerContent">
        <div className="BotoesContent">
          <button onClick={togglePlay} className="botoes">
            {isPlaying ? <Pause className="pause" /> : <Play className="play" />}
          </button>

          <button onClick={toggleMute} className="botoes">
            {isMuted ? <VolumeX className="" /> : <Volume2 className="" />}
          </button>
        </div>

        <audio ref={audioRef} src={streamUrl} />
      </div>
    </div>
  );
};

export default RadioPlayer;
