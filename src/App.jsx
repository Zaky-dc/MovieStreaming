import React, { useState, useMemo } from "react";
import { VideoPlayer } from "./components/VideoPlayer";
import mockData from "./data/mockData.json";
import { Play, Tv, Film } from "lucide-react";

function App() {
  const [currentStream, setCurrentStream] = useState(null);
  const [activeTab, setActiveTab] = useState("movies"); // 'movies', 'series', 'tv', 'torrents'
  const [genreFilter, setGenreFilter] = useState("all");

  const handlePlayerReady = (player) => {
    // Console cleanup
  };

  const playStream = (item) => {
    setCurrentStream({
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      sources: [
        {
          src: item.url,
          type: item.url.endsWith(".m3u8")
            ? "application/x-mpegURL"
            : "video/mp4",
        },
      ],
      poster: item.logo || item.poster,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get unique genres from content
  const genres = useMemo(() => {
    const allGenres = mockData.content
      .map((item) => item.genre)
      .filter(Boolean);
    return ["all", ...new Set(allGenres)];
  }, []);

  // Filter Logic
  const filteredContent = useMemo(() => {
    let content = [];

    // Tab Logic
    if (activeTab === "tv") {
      content = mockData.channels;
    } else if (activeTab === "torrents") {
      content = mockData.content.filter((item) => item.isTorrent);
    } else {
      // Movies and Series (Non-Torrent)
      content = mockData.content.filter(
        (item) => item.category === activeTab && !item.isTorrent,
      );
    }

    // Genre Filter (ignore for TV)
    if (activeTab !== "tv" && genreFilter !== "all") {
      content = content.filter((item) => item.genre === genreFilter);
    }

    return content;
  }, [activeTab, genreFilter]);

  const handleMagnetClick = (e, item) => {
    e.stopPropagation();
    // Open magnet link to trigger external client or copy
    window.open(item.url, "_self");
  };

  const renderGrid = (items, title, icon) => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-gray-400">
          {icon}
          <h2 className="text-xl font-semibold uppercase tracking-wider">
            {title}
          </h2>
        </div>

        {/* Genre Filter UI */}
        {activeTab !== "tv" && (
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="bg-gray-900 text-gray-300 text-sm rounded-lg p-2 border border-gray-700 focus:ring-red-500 focus:border-red-500"
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g === "all" ? "Todos os Gêneros" : g}
              </option>
            ))}
          </select>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500 italic">
          Nenhum conteúdo encontrado nesta categoria.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => playStream(item)}
              className="group relative bg-gray-900 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:z-10 duration-300 ring-1 ring-gray-800"
            >
              {/* Image Container w/ Aspect Ratio */}
              <div className="aspect-[2/3] w-full relative">
                <img
                  src={
                    item.logo ||
                    item.poster ||
                    "https://via.placeholder.com/320x480.png?text=No+Image"
                  }
                  alt={item.name || item.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />

                {/* Overlay Play Button */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 gap-4">
                  <Play className="w-12 h-12 text-white fill-current drop-shadow-lg" />

                  {item.isTorrent && (
                    <button
                      onClick={(e) => handleMagnetClick(e, item)}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-3 rounded-full flex items-center gap-1"
                    >
                      <Film className="w-3 h-3" /> Baixar .torrent
                    </button>
                  )}
                </div>

                {/* Badges */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                  {item.isTorrent && (
                    <span className="bg-purple-600 text-[10px] font-bold text-white px-2 py-0.5 rounded shadow-sm">
                      P2P
                    </span>
                  )}
                  {item.playbackType && (
                    <span
                      className={`text-[10px] font-bold text-white px-2 py-0.5 rounded shadow-sm ${item.playbackType === "dubbed" ? "bg-blue-600" : "bg-yellow-600 text-black"}`}
                    >
                      {item.playbackType === "dubbed" ? "DUB" : "LEG"}
                    </span>
                  )}
                </div>
              </div>

              {/* Content Info */}
              <div className="p-3">
                <h3 className="text-sm font-bold text-gray-100 truncate">
                  {item.name || item.title}
                </h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    {item.genre || "Geral"}
                  </p>
                  <p className="text-xs text-gray-600 border border-gray-700 px-1 rounded">
                    {item.language}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black pb-20 font-sans text-gray-100 selection:bg-red-900 selection:text-white">
      {/* Header / Nav */}
      <header className="fixed top-0 w-full z-50 bg-black/90 p-4 border-b border-gray-800 backdrop-blur-md">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-red-600 tracking-tighter cursor-pointer flex items-center gap-2">
            ZakirFLIX
          </h1>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Primary Navigation */}
            <nav className="flex gap-2 bg-gray-900 p-1.5 rounded-xl border border-gray-800">
              {["movies", "series", "tv", "torrents"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setGenreFilter("all");
                  }}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab
                      ? "bg-gray-700 text-white shadow-md relative overflow-hidden"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {tab === "tv"
                    ? "Ao Vivo"
                    : tab === "movies"
                      ? "Filmes"
                      : tab === "torrents"
                        ? "P2P Torrents"
                        : "Séries"}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero / Player Section */}
      <div className="pt-32 pb-8 px-4 container mx-auto">
        {currentStream ? (
          <div className="max-w-6xl mx-auto bg-gray-900 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
            <VideoPlayer options={currentStream} onReady={handlePlayerReady} />
            <div className="p-6 bg-gray-900/50 backdrop-blur-sm">
              <h2 className="text-2xl text-white font-bold flex items-center gap-2">
                <Play className="fill-current text-red-600" /> Assistindo Agora
              </h2>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto aspect-video bg-gray-900/50 rounded-2xl flex flex-col items-center justify-center text-gray-500 border border-gray-800 border-dashed">
            <Film className="w-20 h-20 mb-6 opacity-30 text-red-600" />
            <p className="text-2xl font-light tracking-wide">
              Bem-vindo ao{" "}
              <span className="text-red-600 font-bold">ZakirFLIX</span>
            </p>
            <p className="text-sm mt-2 opacity-60">
              Selecione um título para começar
            </p>
          </div>
        )}
      </div>

      {/* Content Grids */}
      <main className="container mx-auto px-4">
        {renderGrid(
          filteredContent,
          activeTab === "torrents"
            ? "Downloads & Torrent Streaming"
            : "Catálogo",
          activeTab === "tv" ? (
            <Tv className="text-red-500" />
          ) : (
            <Film className="text-red-500" />
          ),
        )}
      </main>
    </div>
  );
}

export default App;
