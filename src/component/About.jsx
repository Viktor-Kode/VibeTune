import React from 'react';
import about from '/public/about.png';

const About = () => {
  return (
    <section
      id="about"
      className="bg-black text-white py-16 px-6 md:px-20 flex flex-col md:flex-row items-center gap-10"
    >
      {/* Image Section */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img src={about} alt="About VibeTune" className="w-full max-w-sm md:max-w-md rounded-lg shadow-lg" />
      </div>

      {/* Text Section */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-sky-400">About VibeTune</h2>
        <p className="text-base md:text-xl leading-relaxed text-gray-300">
          VibeTune is more than just a music platform—it's a movement. Built for creators, listeners, and dreamers,
          we help you discover the sounds that match your mood, your moment, and your vibe. Whether you're diving into
          Afrobeat rhythms, lo-fi chill, or underground gems, VibeTune connects you to the pulse of global music culture.
        </p>
        <p className="mt-6 text-base md:text-xl leading-relaxed text-gray-300">
          Our mission is simple: empower artists, elevate listeners, and make music discovery feel like magic.
          From curated playlists to real-time search, VibeTune is your gateway to sonic exploration.
        </p>
      </div>
    </section>
    
  );
};

export default About;