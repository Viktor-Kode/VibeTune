// SearchAndPlay.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaPlus } from "react-icons/fa";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

/**
 * SearchAndPlay responsibilities:
 * - search Deezer
 * - play previews
 * - emit "trackChanged" events when track plays (detail: track)
 * - listen for "playbackCommand" events (play/pause/next/prev)
 * - allow adding a track to a user's playlist (writes to Firestore -> user doc.playlists)
 */

const SearchAndPlay = () => {
  const [artistQuery, setArtistQuery] = useState("");
  const [artistResults, setArtistResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(null);
  const [userId, setUserId] = useState(null);

  const currentTrack = currentTrackIndex !== null ? artistResults[currentTrackIndex] : null;

  // auth guard & remember user id to write playlists
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (u) setUserId(u.uid);
      else setUserId(null);
    });
    return () => unsub();
  }, []);

  // When currentTrackIndex changes, start playing and notify Dashboard (via event + localStorage)
  useEffect(() => {
    if (!currentTrack) return;

    // stop & load new src
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = currentTrack.preview || "";
      audioRef.current.volume = volume;
      if (currentTrack.preview) {
        audioRef.current.play().catch(() => {
          /* autoplay might be blocked until user interacts */
        });
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    }

    // announce to dashboard and persist last played
    localStorage.setItem("currentTrack", JSON.stringify(currentTrack));
    window.dispatchEvent(new CustomEvent("trackChanged", { detail: currentTrack }));
    // also send playback state
    window.dispatchEvent(new CustomEvent("playbackState", { detail: { isPlaying: true } }));
    // increment streamed via statsUpdated event (dashboard will also increment locally)
    window.dispatchEvent(new CustomEvent("statsUpdated", { detail: { streamed: 1 } }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex]); // intentional

  // Listen for dashboard commands: play/pause/next/prev
  useEffect(() => {
    const onCmd = (e) => {
      const { cmd } = e.detail || {};
      if (!cmd) return;
      if (cmd === "play") {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      } else if (cmd === "pause") {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      } else if (cmd === "next") {
        playNext();
      } else if (cmd === "prev") {
        playPrev();
      }
    };

    window.addEventListener("playbackCommand", onCmd);
    return () => window.removeEventListener("playbackCommand", onCmd);
  }, [artistResults, currentTrackIndex]);

  // Play / Pause toggles
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      window.dispatchEvent(new CustomEvent("playbackState", { detail: { isPlaying: false } }));
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      window.dispatchEvent(new CustomEvent("playbackState", { detail: { isPlaying: true } }));
    }
  };

  const playNext = () => {
    if (!artistResults.length) return;
    setCurrentTrackIndex((prev) => {
      const next = (prev === null ? 0 : (prev + 1) % artistResults.length);
      return next;
    });
  };

  const playPrev = () => {
    if (!artistResults.length) return;
    setCurrentTrackIndex((prev) => {
      const prevIdx = prev === null ? 0 : (prev - 1 + artistResults.length) % artistResults.length;
      return prevIdx;
    });
  };

  // add track to a playlist in Firestore
  const addToPlaylist = async (track) => {
    if (!userId) {
      alert("Please log in to add to playlists.");
      return;
    }
    // Fetch user doc
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};
      const playlists = userData.playlists || [];

      // If no playlists, ask to create one
      if (!playlists.length) {
        const name = prompt("You have no playlists yet. Enter a name for a new playlist:");
        if (!name) return;
        const newPlaylists = [{ name, songs: [{ id: track.id, title: track.title, artist: track.artist, album: track.album, preview: track.preview }] }];
        await updateDoc(userRef, { playlists: newPlaylists });
        alert("Playlist created and song added.");
        return;
      }

      // choose playlist
      const names = playlists.map((p, i) => `${i + 1}. ${p.name}`).join("\n");
      const chosen = prompt(`Pick playlist number to add to:\n${names}`);
      if (!chosen) return;
      const idx = parseInt(chosen, 10) - 1;
      if (isNaN(idx) || idx < 0 || idx >= playlists.length) {
        alert("Invalid choice");
        return;
      }

      // push song into selected playlist
      const updated = [...playlists];
      updated[idx].songs = updated[idx].songs || [];
      // avoid duplicates by id
      if (!updated[idx].songs.find((s) => s.id === track.id)) {
        updated[idx].songs.push({ id: track.id, title: track.title, artist: track.artist, album: track.album, preview: track.preview });
        await updateDoc(userRef, { playlists: updated });
        alert("Added to playlist");
      } else {
        alert("Song already in playlist");
      }
    } catch (err) {
      console.error("addToPlaylist error:", err);
      alert("Failed to add song to playlist");
    }
  };

  // Search Deezer
  const searchTracks = async () => {
    if (!artistQuery) return;
    setSearchLoading(true);
    try {
      const res = await fetch(
        `https://cors-anywhere.herokuapp.com/http://api.deezer.com/search?q=${encodeURIComponent(artistQuery)}`
      );
      const data = await res.json();
      setArtistResults(data.data || []);
      if (data.data?.length > 0) {
        setCurrentTrackIndex(0);
        // will auto-emit trackChanged via useEffect
      } else {
        setCurrentTrackIndex(null);
      }
    } catch (err) {
      console.error("Deezer fetch error:", err);
      alert("Search failed");
    }
    setSearchLoading(false);
  };

  // Add song (manual) -> convenience to add track to playlist (if no preview)
  const addSongPrompt = async () => {
    const title = prompt("Enter full song title to search/add:");
    if (title) {
      setArtistQuery(title);
      await searchTracks();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pb-28"> {/* pb to avoid being hidden by fixed player */}
      <h2 className="text-2xl font-bold mb-4">Search Songs (Deezer)</h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          className="px-4 py-2 rounded bg-gray-700 text-white w-full"
          placeholder="e.g. Essence, Burna Boy"
          value={artistQuery}
          onChange={(e) => setArtistQuery(e.target.value)}
        />
        <div className="flex gap-2">
          <button onClick={searchTracks} className="bg-sky-400 text-black px-4 py-2 rounded hover:bg-sky-500">Search</button>
          <button onClick={addSongPrompt} className="bg-gray-700 border border-gray-600 px-4 py-2 rounded text-gray-200">Quick Add</button>
        </div>
      </div>

      {searchLoading && <p className="text-gray-300 mb-4">Loading...</p>}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {artistResults.map((track, idx) => (
          <div key={track.id || idx} className="bg-gray-800 p-4 rounded-lg flex flex-col">
            <img src={track.album?.cover || "https://via.placeholder.com/200"} alt={track.title} className="w-full h-40 object-cover rounded mb-3" />
            <h4 className="text-sky-300 font-semibold">{track.title}</h4>
            <p className="text-gray-400 text-sm mb-3">{track.artist?.name} — {track.album?.title}</p>

            <div className="mt-auto flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button onClick={() => { setCurrentTrackIndex(idx); }} className="bg-sky-400 text-black px-3 py-1 rounded">Play</button>
                <button onClick={() => addToPlaylist(track)} title="Add to playlist" className="bg-gray-700 px-2 py-1 rounded border border-gray-600">
                  <FaPlus />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={playPrev} className="text-gray-300"><FaStepBackward /></button>
                <button onClick={() => togglePlay()} className="text-gray-300">{isPlaying ? <FaPause /> : <FaPlay />}</button>
                <button onClick={playNext} className="text-gray-300"><FaStepForward /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hidden audio element controlled here. Dashboard only sends commands. */}
      <audio ref={audioRef} onTimeUpdate={() => {
        // emit a lightweight event if you want to share current time in future
      }} onEnded={() => {
        // auto next when ended
        playNext();
      }} />

      {/* Fixed mini player (mirrors local currentTrack) */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-3 flex items-center gap-3 md:gap-6">
          <img src={currentTrack.album?.cover} alt={currentTrack.title} className="w-12 h-12 rounded object-cover" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{currentTrack.title}</div>
                <div className="text-gray-400 text-sm">{currentTrack.artist?.name}</div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={playPrev}><FaStepBackward /></button>
                <button onClick={togglePlay} className="bg-white text-black rounded-full p-2">{isPlaying ? <FaPause /> : <FaPlay />}</button>
                <button onClick={playNext}><FaStepForward /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndPlay;
