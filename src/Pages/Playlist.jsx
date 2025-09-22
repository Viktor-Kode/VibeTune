import React, { useState } from "react";

const Playlist = () => {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [songInputs, setSongInputs] = useState({}); // track input per playlist

  const addPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    setPlaylists([...playlists, { name: newPlaylistName, songs: [] }]);
    setNewPlaylistName("");
  };

  const addSong = (playlistIndex, title, artist) => {
    if (!title.trim() || !artist.trim()) return;
    const updated = [...playlists];
    updated[playlistIndex].songs.push({ title, artist });
    setPlaylists(updated);
    setSongInputs({ ...songInputs, [playlistIndex]: { title: "", artist: "" } });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-6">🎶 Manage Your Playlists</h2>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter playlist name"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          className="px-3 py-2 rounded bg-gray-700 text-white w-full"
        />
        <button
          onClick={addPlaylist}
          className="bg-sky-400 text-black px-4 py-2 rounded hover:bg-sky-500"
        >
          Add Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <p className="text-gray-400">No playlists yet. Create one above!</p>
      ) : (
        playlists.map((playlist, idx) => (
          <div key={idx} className="bg-gray-800 rounded-lg p-4 mb-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-3 text-sky-300">{playlist.name}</h3>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Song title"
                value={songInputs[idx]?.title || ""}
                onChange={(e) => setSongInputs({ ...songInputs, [idx]: { ...songInputs[idx], title: e.target.value } })}
                className="px-2 py-1 rounded bg-gray-700 text-white w-full"
              />
              <input
                type="text"
                placeholder="Artist"
                value={songInputs[idx]?.artist || ""}
                onChange={(e) => setSongInputs({ ...songInputs, [idx]: { ...songInputs[idx], artist: e.target.value } })}
                className="px-2 py-1 rounded bg-gray-700 text-white w-full"
              />
              <button
                onClick={() => addSong(idx, songInputs[idx]?.title || "", songInputs[idx]?.artist || "")}
                className="bg-green-500 text-black px-3 rounded hover:bg-green-600"
              >
                Add
              </button>
            </div>

            {playlist.songs.length === 0 ? (
              <p className="text-gray-400">No songs in this playlist.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {playlist.songs.map((song, sIdx) => (
                  <li key={sIdx} className="flex justify-between items-center bg-gray-700 px-3 py-2 rounded">
                    <span>{song.title} - <span className="text-gray-400">{song.artist}</span></span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Playlist;
