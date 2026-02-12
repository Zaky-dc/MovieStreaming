import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import WebTorrent from "webtorrent";

// O Buffer é essencial para o WebTorrent processar pedaços do vídeo no browser
import { Buffer } from "buffer";
if (typeof window !== "undefined" && !window.Buffer) {
  window.Buffer = Buffer;
}

// Inicializamos o cliente WebTorrent fora do componente para evitar múltiplas instâncias
const client = new WebTorrent({ dht: false });

export const VideoPlayer = ({ options, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isTorrent, setIsTorrent] = useState(false);
  const [torrentStatus, setTorrentStatus] = useState("");

  useEffect(() => {
    // Função de limpeza para resetar o player e parar torrents ativos ao trocar de canal
    const cleanup = () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }

      // Para todos os torrents ativos para libertar memória e banda
      client.torrents.forEach((t) => t.destroy());

      if (videoRef.current) {
        videoRef.current.innerHTML = "";
      }
    };

    cleanup();

    const src = options.sources?.[0]?.src || "";

    // Lógica 1: Reprodução via TORRENT (Magnet Links)
    if (src.startsWith("magnet:")) {
      setIsTorrent(true);
      setTorrentStatus("Procurando sementes (peers)...");

      client.add(src, (torrent) => {
        setTorrentStatus("Descarregando metadados...");

        // Procura o primeiro arquivo de vídeo disponível no torrent
        const file = torrent.files.find((f) =>
          f.name.endsWith(".mp4") || f.name.endsWith(".webm") || f.name.endsWith(".mkv")
        );

        if (file) {
          setTorrentStatus(`Streaming: ${file.name}`);
          
          const videoElement = document.createElement("video");
          videoElement.className = "w-full h-full";
          videoElement.controls = true;
          videoElement.autoplay = options.autoplay;

          if (videoRef.current) {
            videoRef.current.appendChild(videoElement);
            // O WebTorrent renderiza o stream diretamente no elemento <video>
            file.renderTo(videoElement, { autoplay: options.autoplay });
          }
        } else {
          setTorrentStatus("Erro: Nenhum ficheiro de vídeo encontrado.");
        }
      });

      client.on("error", (err) => {
        setTorrentStatus(`Erro no Torrent: ${err.message}`);
      });

    } else {
      // Lógica 2: Reprodução via VIDEO.JS (Canais M3U8 e MP4)
      setIsTorrent(false);
      setTorrentStatus("");

      if (videoRef.current) {
        const videoElement = document.createElement("video-js");
        videoElement.classList.add("vjs-big-play-centered", "vjs-theme-city");
        videoRef.current.appendChild(videoElement);

        const player = (playerRef.current = videojs(
          videoElement,
          {
            ...options,
            html5: {
              vhs: {
                overrideNative: true, // Garante que o motor HLS funcione em todos os browsers
                allowSeeksWithinUnsafeLiveWindow: true,
              },
            },
          },
          () => {
            console.log("Player de vídeo/TV pronto!");
            onReady && onReady(player);
          }
        ));

        // Listener para erros de carregamento (CORS ou links offline)
        player.on("error", () => {
          console.error("Erro no carregamento do stream. Verifica o link ou permissões CORS.");
        });
      }
    }

    return cleanup;
  }, [options]);

  return (
    <div className="w-full h-full relative bg-black rounded-xl shadow-inner group">
      {/* Container onde o player será injetado */}
      <div ref={videoRef} className="w-full h-full" />

      {/* Overlay de Status para Torrents */}
      {isTorrent && (
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-red-600/90 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest animate-pulse">
            {torrentStatus}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
