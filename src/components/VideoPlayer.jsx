import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import WebTorrent from "webtorrent";

// Ensure Buffer is available globally for WebTorrent
import { Buffer } from "buffer";
if (!window.Buffer) window.Buffer = Buffer;

// Initialize client outside component to persist,
// though for this use case we might want to manage it closer to lifecycle if we want to stop seeding strictly.
// Disable DHT as it relies on UDP which is not available in browser and causes issues with shims
const client = new WebTorrent({
  dht: false,
});

export const VideoPlayer = ({ options, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isTorrent, setIsTorrent] = useState(false);
  const [torrentStatus, setTorrentStatus] = useState("");

  useEffect(() => {
    // Basic cleanup of previous player/torrent
    const cleanup = () => {
      // Dispose video.js player
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }

      // Stop previous torrents
      if (client.torrents.length > 0) {
        client.torrents.forEach((t) => t.destroy());
      }

      // Remove any existing video elements in container to avoid duplicates
      if (videoRef.current) {
        videoRef.current.innerHTML = "";
      }
    };

    cleanup();

    const { sources } = options;
    const src = sources && sources[0] ? sources[0].src : "";

    if (src.startsWith("magnet:")) {
      setIsTorrent(true);
      setTorrentStatus("Connecting to peers...");

      // Torrent Logic
      client.add(src, (torrent) => {
        setTorrentStatus("Downloading Metadata...");

        // Find the first video file
        const file = torrent.files.find(
          (file) =>
            file.name.endsWith(".mp4") ||
            file.name.endsWith(".webm") ||
            file.name.endsWith(".mkv"),
        );

        if (file) {
          setTorrentStatus(`Streaming: ${file.name}`);

          // Create video element for torrent
          const videoElement = document.createElement("video");
          videoElement.className = "w-full h-full";
          videoElement.controls = true;
          videoElement.autoplay = options.autoplay;

          if (videoRef.current) {
            videoRef.current.innerHTML = ""; // Clear container
            videoRef.current.appendChild(videoElement);
            // Render to the video element
            file.renderTo(videoElement, { autoplay: options.autoplay });
          }
        } else {
          setTorrentStatus("No playable video file found in torrent.");
        }
      });

      // Handle torrent errors
      client.on("error", (err) => {
        setTorrentStatus(`Error: ${err.message}`);
      });
    } else {
      setIsTorrent(false);
      setTorrentStatus("");

      // Video.js Logic
      if (videoRef.current) {
        videoRef.current.innerHTML = "";

        const videoElement = document.createElement("video-js");
        videoElement.classList.add("vjs-big-play-centered");
        videoRef.current.appendChild(videoElement);

        const player = (playerRef.current = videojs(
          videoElement,
          options,
          () => {
            videojs.log("player is ready");
            onReady && onReady(player);
          },
        ));
      }
    }

    return () => {
      // Cleanup on effect dependency change is handled by the initial cleanup call of the next run
      // But we can also do partial cleanup here if needed.
    };
  }, [options]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
      }
      if (client.torrents.length > 0) {
        client.torrents.forEach((t) => t.destroy());
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative group">
      <div
        ref={videoRef}
        className="w-full h-full rounded-lg overflow-hidden shadow-2xl bg-black"
      />

      {isTorrent && torrentStatus && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded pointer-events-none z-10 font-mono">
          {torrentStatus}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
