import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import {
  FaHome,
  FaMusic,
  FaListUl,
  FaCog,
  FaSignOutAlt,
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [stats, setStats] = useState({
    playlists: 0,
    streamed: 0,
    favorites: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserName(user.displayName || user.email?.split("@")[0] || "Guest");
        setUserEmail(user.email);

        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setStats({
              playlists: data.playlists?.length ?? 0,
              streamed: data.streamed ?? 0,
              favorites: data.favorites ?? 0,
              recentActivity: data.recentActivity ?? [],
            });
          }
        } catch (err) {
          console.error("Error fetching user doc:", err);
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Load last track & listen for updates from SearchAndPlay
  useEffect(() => {
    const last = localStorage.getItem("currentTrack");
    if (last) {
      try {
        setCurrentTrack(JSON.parse(last));
      } catch {}
    }

    const onTrackChanged = (e) => {
      const track = e.detail;
      if (!track) return;
      setCurrentTrack(track);
      setIsPlaying(true);

      setStats((prev) => ({
        ...prev,
        streamed: (prev.streamed ?? 0) + 1,
        recentActivity: [track.title, ...(prev.recentActivity ?? [])].slice(0, 10),
      }));
    };

    const onStatsUpdated = (e) => {
      const newStats = e.detail;
      if (!newStats) return;
      setStats((prev) => ({ ...prev, ...newStats }));
    };

    const onPlaybackState = (e) => {
      const { isPlaying: playing } = e.detail || {};
      if (typeof playing === "boolean") setIsPlaying(playing);
    };

    window.addEventListener("trackChanged", onTrackChanged);
    window.addEventListener("statsUpdated", onStatsUpdated);
    window.addEventListener("playbackState", onPlaybackState);

    return () => {
      window.removeEventListener("trackChanged", onTrackChanged);
      window.removeEventListener("statsUpdated", onStatsUpdated);
      window.removeEventListener("playbackState", onPlaybackState);
    };
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const sendCommand = (cmd) => {
    window.dispatchEvent(new CustomEvent("playbackCommand", { detail: { cmd } }));
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl text-sky-300">Loading your dashboard...</p>
      </section>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-800 p-6 flex flex-col justify-between transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-sky-400">VibeTune 🎧</h1>
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <FaTimes size={20} />
            </button>
          </div>

          <nav className="space-y-4 mb-8">
            <Link to="/" className="flex items-center gap-3 hover:text-sky-400"><FaHome /> Home</Link>
            <Link to="/search" className="flex items-center gap-3 hover:text-sky-400"><FaMusic /> Library</Link>
            <Link to="/playlists" className="flex items-center gap-3 hover:text-sky-400"><FaListUl /> Playlists</Link>
            <a href="#" className="flex items-center gap-3 hover:text-sky-400"><FaCog /> Settings</a>
          </nav>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg mt-6">
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
        <div className="flex justify-between items-center mb-6 md:hidden">
          <button className="text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
            <FaBars size={22} />
          </button>
          <Link to="/search" className="bg-sky-400 text-black px-4 py-2 rounded-lg hover:bg-sky-500">Search</Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Welcome back, {userName} 👋</h2>
            <p className="text-gray-400 text-sm md:text-base">Email: {userEmail}</p>
          </div>
          <Link to="/playlists" className="hidden md:block bg-sky-400 text-black px-4 py-2 rounded-lg hover:bg-sky-500 mt-4 md:mt-0">Your Playlists</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-sky-300">Playlists</h3>
            <p className="text-3xl font-bold mt-2">{stats.playlists ?? 0}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-sky-300">Songs Streamed</h3>
            <p className="text-3xl font-bold mt-2">{stats.streamed ?? 0}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-sky-300">Favorites</h3>
            <p className="text-3xl font-bold mt-2">{stats.favorites ?? 0}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h3 className="text-xl font-semibold text-sky-300 mb-4">Recent Activity</h3>
          <ul className="space-y-2 text-gray-300 text-sm md:text-base">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((item, idx) => <li key={idx}>🎵 {item}</li>)
            ) : (
              <li>No recent activity yet.</li>
            )}
          </ul>
        </div>
      </main>

      {/* Now Playing Bar */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-700 p-3 md:p-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
          <div className="flex items-center gap-3 md:gap-4">
            <img src={currentTrack.album?.cover || "https://via.placeholder.com/50"} alt={currentTrack.title} className="w-10 h-10 md:w-12 md:h-12 rounded object-cover" />
            <div>
              <p className="font-semibold text-sm md:text-base">{currentTrack.title}</p>
              <p className="text-xs md:text-sm text-gray-400">{currentTrack.artist?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={() => sendCommand("prev")}><FaStepBackward /></button>
            <button onClick={() => sendCommand(isPlaying ? "pause" : "play")} className="text-xl md:text-2xl bg-white text-black rounded-full p-2">
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={() => sendCommand("next")}><FaStepForward /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
