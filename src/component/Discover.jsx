import React from 'react';

const Discover = () => {
  return (
    <section
      id="discover"
      className=" bg-gradient-to-b from-gray-900 to-black text-white py-16 px-6 md:px-20 flex justify-center"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-sky-400">Discover New Vibes</h2>
        <p className="text-lg md:text-xl text-gray-300 mb-12">
          Explore trending tracks, fresh drops, and hidden gems curated just for you. VibeTune brings you the pulse of global music culture—updated daily.
        </p>

        {/* Grid of Discover Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Sample Card */}
          <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition">
            <h3 className="text-xl font-semibold mb-2">🔥 Afrobeat Essentials</h3>
            <p className="text-gray-400 text-sm">Feel the rhythm with the hottest Afrobeat tracks of the week.</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition">
            <h3 className="text-xl font-semibold mb-2">🎧 Lo-Fi Chill</h3>
            <p className="text-gray-400 text-sm">Perfect for studying, relaxing, or late-night vibes.</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition">
            <h3 className="text-xl font-semibold mb-2">🌍 Global Gems</h3>
            <p className="text-gray-400 text-sm">Discover underground sounds from Lagos to Tokyo.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Discover;