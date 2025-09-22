// SearchAndPlay.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp } from "react-icons/fa";

const SearchAndPlay = () => {
  const [artistQuery, setArtistQuery] = useState("");
  const [artistResults, setArtistResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(null);

  const currentTrack = currentTrackIndex !== null ? artistResults[currentTrackIndex] : null;

  // Reset audio when track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const newTime = (e.target.value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(e.target.value);
    }
  };

  const handleVolume = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  const searchTracks = async () => {
    if (!artistQuery) return;
    setSearchLoading(true);
    try {
      const res = await fetch(
        `https://cors-anywhere.herokuapp.com/http://api.deezer.com/search?q=${encodeURIComponent(artistQuery)}`
      );
      const data = await res.json();
      setArtistResults(data.data || []);
      if (data.data?.length > 0) setCurrentTrackIndex(0); // auto-select first track
    } catch (err) {
      console.error("Deezer fetch error:", err);
    }
    setSearchLoading(false);
  };

  const playNext = () => {
    if (artistResults.length === 0) return;
    setCurrentTrackIndex((prev) => (prev + 1) % artistResults.length);
  };

  const playPrev = () => {
    if (artistResults.length === 0) return;
    setCurrentTrackIndex((prev) => (prev - 1 + artistResults.length) % artistResults.length);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-4">Search Songs (Deezer)</h2>

      {/* Search Box */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={artistQuery}
          onChange={(e) => setArtistQuery(e.target.value)}
          placeholder="e.g. Essence, Burna Boy"
          className="px-4 py-2 rounded bg-gray-700 text-white w-full"
        />
        <button
          onClick={searchTracks}
          className="bg-sky-400 text-black px-4 py-2 rounded hover:bg-sky-500"
        >
          Search
        </button>
      </div>

      {/* Loading */}
      {searchLoading && <p className="text-gray-300 mb-4">Loading...</p>}

      {/* Search Results */}
      {artistResults.length > 0 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-32">
          {artistResults.map((track, idx) => (
            <div
              key={idx}
              className="bg-gray-700 p-4 rounded-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setCurrentTrackIndex(idx)}
            >
              <img
                src={track.album.cover}
                alt={track.title}
                className="h-32 object-cover rounded mb-2"
              />
              <h4 className="text-sky-300 font-bold">{track.title}</h4>
              <p className="text-sm text-gray-300">{track.artist.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Control Panel */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-700 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-4">
            {currentTrack?.album?.cover && (
              <img
                src={currentTrack.album.cover}
                alt={currentTrack.title}
                className="w-14 h-14 rounded"
              />
            )}
            <div>
              <h4 className="text-white font-semibold">{currentTrack?.title}</h4>
              <p className="text-gray-400 text-sm">{currentTrack?.artist?.name}</p>
              <p className="text-gray-400 text-xs">{currentTrack?.album?.title}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center w-1/2">
            <div className="flex items-center gap-6 mb-2">
              <button onClick={playPrev} className="text-white hover:text-sky-400">
                <FaStepBackward size={18} />
              </button>
              <button
                onClick={togglePlay}
                className="bg-white text-black rounded-full p-2 hover:bg-sky-400"
              >
                {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
              </button>
              <button onClick={playNext} className="text-white hover:text-sky-400">
                <FaStepForward size={18} />
              </button>
            </div>

            {/* Progress Bar */}
            <input
              type="range"
              value={progress}
              onChange={handleSeek}
              className="w-full"
            />
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 w-32">
            <FaVolumeUp className="text-white" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolume}
              className="w-full"
            />
          </div>

          {/* Hidden Audio */}
          {currentTrack?.preview && (
            <audio
              ref={audioRef}
              src={currentTrack.preview}
              onTimeUpdate={handleTimeUpdate}
              autoPlay={isPlaying}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndPlay;
