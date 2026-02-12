import React, { useState, useMemo } from "react";
import { VideoPlayer } from "./components/VideoPlayer";
import mockData from "./data/mockData.json";
import { Play, Tv, Film } from "lucide-react";

function App() {
  const [currentStream, setCurrentStream] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'tv', 'movies', 'series'
  const [languageFilter, setLanguageFilter] = useState("all"); // 'all', 'dubbed', 'subtitled', 'international'

  const handlePlayerReady = (player) => {
    player.on("waiting", () => {
      console.log("player is waiting");
    });

    player.on("dispose", () => {
      console.log("player will dispose");
    });
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
    // Scroll to player
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter Logic
  const filteredContent = useMemo(() => {
    let content = [];

    // Combine channels and content based on primary tab
    if (activeTab === "all") {
      content = [...mockData.channels, ...mockData.content];
    } else if (activeTab === "tv") {
      content = mockData.channels;
    } else {
      content = mockData.content.filter((item) => item.category === activeTab);
    }

    // Apply Language/Type Filter
    if (languageFilter !== "all") {
      content = content.filter((item) => {
        if (languageFilter === "dubbed") return item.playbackType === "dubbed";
        if (languageFilter === "subtitled")
          return item.playbackType === "subtitled";
        if (languageFilter === "international")
          return item.language !== "PT" && !item.playbackType;
        return true;
      });
    }

    return content;
  }, [activeTab, languageFilter]);

  const renderGrid = (items, title, icon) => (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6 text-gray-400">
        {icon}
        <h2 className="text-xl font-semibold uppercase tracking-wider">
          {title}
        </h2>
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
              className="group relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:z-10 duration-300"
            >
              {/* Image Container w/ Aspect Ratio */}
              <div className="aspect-video w-full relative">
                <img
                  src={
                    item.logo ||
                    item.poster ||
                    "https://via.placeholder.com/320x180.png?text=No+Image"
                  }
                  alt={item.name || item.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />

                {/* Overlay Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <Play className="w-12 h-12 text-white fill-current" />
                </div>

                {/* Badges */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {item.playbackType === "dubbed" && (
                    <span className="bg-blue-600 text-xs text-white px-2 py-1 rounded">
                      Dub
                    </span>
                  )}
                  {item.playbackType === "subtitled" && (
                    <span className="bg-yellow-600 text-xs text-black px-2 py-1 rounded">
                      Leg
                    </span>
                  )}
                  {item.category === "tv" && (
                    <span className="bg-red-600 text-xs text-white px-2 py-1 rounded">
                      Ao Vivo
                    </span>
                  )}
                </div>
              </div>

              {/* Content Info */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-200 truncate">
                  {item.name || item.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {item.category} • {item.language}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Header / Nav */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/95 to-transparent p-4 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-red-600 tracking-tighter cursor-pointer flex items-center gap-2">
            ZakirFLIX{" "}
            <span className="text-xs text-gray-500 font-normal border border-gray-700 px-2 py-0.5 rounded">
              BETA
            </span>
          </h1>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Primary Navigation */}
            <nav className="flex gap-1 bg-gray-900/80 p-1 rounded-lg">
              {["all", "tv", "movie", "series"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-red-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {tab === "all"
                    ? "Tudo"
                    : tab === "tv"
                      ? "TV Ao Vivo"
                      : tab === "movie"
                        ? "Filmes"
                        : "Séries"}
                </button>
              ))}
            </nav>

            {/* Language Filter */}
            <div className="flex gap-2 text-xs">
              <button
                onClick={() =>
                  setLanguageFilter(
                    languageFilter === "dubbed" ? "all" : "dubbed",
                  )
                }
                className={`px-3 py-1 rounded-full border transition ${languageFilter === "dubbed" ? "bg-blue-600 border-blue-600 text-white" : "border-gray-700 text-gray-400 hover:border-gray-500"}`}
              >
                Dublados
              </button>
              <button
                onClick={() =>
                  setLanguageFilter(
                    languageFilter === "subtitled" ? "all" : "subtitled",
                  )
                }
                className={`px-3 py-1 rounded-full border transition ${languageFilter === "subtitled" ? "bg-yellow-600 border-yellow-600 text-white" : "border-gray-700 text-gray-400 hover:border-gray-500"}`}
              >
                Legendados
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero / Player Section */}
      <div className="pt-32 pb-8 px-4 container mx-auto">
        {currentStream ? (
          <div className="max-w-5xl mx-auto bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-gray-800">
            <VideoPlayer options={currentStream} onReady={handlePlayerReady} />
            <div className="p-4 bg-gray-900">
              <h2 className="text-xl text-white font-bold">Now Playing</h2>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto aspect-video bg-gray-900 rounded-xl flex flex-col items-center justify-center text-gray-500 border border-gray-800 border-dashed bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <Tv className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-light">
              Selecione um canal ou filme para assistir
            </p>
          </div>
        )}
      </div>

      {/* Content Grids */}
      <main className="container mx-auto px-4">
        {renderGrid(
          filteredContent,
          languageFilter !== "all"
            ? `Resultados: ${languageFilter}`
            : "Catálogo Completo",
          <Film className="w-5 h-5" />,
        )}
      </main>
    </div>
  );
}

export default App;
