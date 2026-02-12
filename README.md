# Movie Streaming MVP

A minimalist movie streaming platform built with React, Vite, and Tailwind CSS. Supports HLS streams (TV Channels), direct file playback (MP4/MKV), and Magnet Torrent streaming directly in the browser.

## Features

- **Live TV**: Supports HLS (.m3u8) streams.
- **Movies & Series**: Supports direct video file links.
- **Torrent Streaming**: Native in-browser P2P streaming via WebTorrent (using Magnet URIs).
- **Modern UI**: Netflix-inspired dark mode interface.
- **Custom Player**: Robust video.js integration with custom skins.

## Getting Started

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

    _Note: If you encounter errors due to optional dependencies, run `npm install --force`._

2.  **Run Development Server**:

    ```bash
    npm run dev
    ```

3.  **Open in Browser**:
    Navigate to `http://localhost:5173` (or the port shown in terminal).

## Adding Content

Edit `src/data/mockData.json` to add your own streams or magnet links.

**Example Direct Link:**

```json
{
  "id": 101,
  "title": "My Movie",
  "poster": "https://example.com/poster.jpg",
  "url": "https://example.com/movie.mp4",
  "category": "movie",
  "language": "EN",
  "playbackType": "original"
}
```

**Example Torrent Link:**

```json
{
  "id": 301,
  "title": "Open Source Movie",
  "poster": "https://example.com/poster.jpg",
  "url": "magnet:?xt=urn:btih:...",
  "category": "movie",
  "language": "EN",
  "playbackType": "original"
}
```

## Troubleshooting

- **Torrent Errors**: If you see "Connecting to peers..." indefinitely, the torrent may have few web seeds. WebTorrent in the browser requires WebRTC-capable peers (WebSeeds).
- **504/Build Errors**: If Vite fails to build due to Node polyfills, clean the cache: `rm -rf node_modules/.vite` and restart with `npm run dev -- --force`.

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Video**: video.js + webtorrent
- **Icons**: lucide-react
