// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import {
  FaHome, FaMusic, FaListUl, FaCog, FaSignOutAlt,
  FaPlay, FaPause, FaStepForward, FaStepBackward,
  FaBars, FaTimes,
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Deezer search states


  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserName(user.displayName || user.email?.split("@")[0] || "Guest");
        setUserEmail(user.email);

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) setStats(userDoc.data());
      } else navigate("/login");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
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
            <a href="#" className="flex items-center gap-3 hover:text-sky-400"><FaHome /> Home</a>
          <Link to='/search'>  <a href="#" className="flex items-center gap-3 hover:text-sky-400"><FaMusic /> Library</a></Link>
          <Link to='/playlist'> <a href="#" className="flex items-center gap-3 hover:text-sky-400"><FaListUl /> Playlists</a></Link> 
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
          <button className="bg-sky-400 text-black px-4 py-2 rounded-lg hover:bg-sky-500">Upgrade Plan</button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Welcome back, {userName} 👋</h2>
            <p className="text-gray-400 text-sm md:text-base">Email: {userEmail}</p>
          </div>
          <button className="hidden md:block bg-sky-400 text-black px-4 py-2 rounded-lg hover:bg-sky-500 mt-4 md:mt-0">Upgrade Plan</button>
        </div>

        {/* Deezer Search */}
        <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold text-sky-300 mb-2">Search Songs </h3>
          <div className="flex gap-2 mb-2">
            <Link to='/search'>
            <input
              type="text"
              placeholder="e.g. Essence, Burna Boy"
              className="px-3 py-1 rounded bg-gray-700 text-white w-full"
            />
            </Link>
            <button className="bg-sky-400 text-black px-3 rounded hover:bg-sky-500">Search</button>
          </div>
            </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-sky-300">Playlists</h3>
            <p className="text-3xl font-bold mt-2">{stats.playlists}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-sky-300">Songs Streamed</h3>
            <p className="text-3xl font-bold mt-2">{stats.streamed}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-sky-300">Favorites</h3>
            <p className="text-3xl font-bold mt-2">{stats.favorites}</p>
          </div>
        </div>

        {/* Recent Activity & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-sky-300 mb-4">Recent Activity</h3>
            <ul className="space-y-2 text-gray-300 text-sm md:text-base">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((item, idx) => (
                  <li key={idx}>🎵 {item}</li>
                ))
              ) : (
                <li>No recent activity yet.</li>
              )}
            </ul>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-sky-300 mb-4">Recommended For You</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {["album1","album2","album3","album4"].map((album, idx) => (
                <div key={idx} className="bg-gray-700 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                  <img src={`https://via.placeholder.com/150?text=Album+${idx+1}`} alt={`Album ${idx+1}`} className="w-full h-28 object-cover"/>
                  <p className="p-2 text-xs md:text-sm">Album {idx+1}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Now Playing Bar */}
     
    </div>
  );
};

export default Dashboard;
