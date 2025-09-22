import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-300 py-8 px-6 md:px-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
        {/* Logo or Brand */}
        <h1 className="text-2xl font-bold text-white">VibeTune</h1>

        {/* Links */}
        <ul className="flex gap-6 text-sm">
          <li><a href="#about" className="hover:text-sky-400 transition">About</a></li>
          <li><a href="#discover" className="hover:text-sky-400 transition">Discover</a></li>
          <li><a href="#contact" className="hover:text-sky-400 transition">Contact</a></li>
        </ul>

        {/* Copyright */}
        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} VibeTune. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;