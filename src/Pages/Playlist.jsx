// Playlist.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { FaPlay, FaPlus, FaTrash } from "react-icons/fa";

const Playlist = () => {
  const [userId, setUserId] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchPlaylists(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchPlaylists = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      setPlaylists(userDoc.data().playlists || []);
    }
  };

  const playSong = (track) => {
    // Update dashboard via localStorage & custom event
    localStorage.setItem("currentTrack", JSON.stringify(track));
    window.dispatchEvent(new CustomEvent("trackChanged", { detail: track }));
  };

  const addSongToPlaylist = async (playlistIndex) => {
    const songTitle = prompt("Enter song title:");
    if (!songTitle) return;
    
    const updatedPlaylists = [...playlists];
    updatedPlaylists[playlistIndex].songs.push({ title: songTitle });
    setPlaylists(updatedPlaylists);

    // Update Firestore
    await updateDoc(doc(db, "users", userId), { playlists: updatedPlaylists });
  };

  const removeSongFromPlaylist = async (playlistIndex, songIndex) => {
    const updatedPlaylists = [...playlists];
    updatedPlaylists[playlistIndex].songs.splice(songIndex, 1);
    setPlaylists(updatedPlaylists);

    // Update Firestore
    await updateDoc(doc(db, "users", userId), { playlists: updatedPlaylists });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((pl, idx) => (
          <div key={idx} className="bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-sky-300">{pl.name}</h3>
              <button
                className="text-green-400 hover:text-green-500"
                onClick={() => setSelectedPlaylist(idx)}
              >
                <FaPlay />
              </button>
            </div>

            {selectedPlaylist === idx && (
              <ul className="mt-2 space-y-1">
                {pl.songs.map((song, sIdx) => (
                  <li key={sIdx} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                    <span>{song.title}</span>
                    <div className="flex gap-2">
                      <button
                        className="text-green-400 hover:text-green-500"
                        onClick={() => playSong(song)}
                      >
                        <FaPlay />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-500"
                        onClick={() => removeSongFromPlaylist(idx, sIdx)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
                <li className="mt-2">
                  <button
                    className="flex items-center gap-2 bg-sky-400 text-black px-3 py-1 rounded hover:bg-sky-500"
                    onClick={() => addSongToPlaylist(idx)}
                  >
                    <FaPlus /> Add Song
                  </button>
                </li>
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
