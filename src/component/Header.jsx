import React from "react";
import banner from "/public/banner.mp4";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="w-full h-[100vh] ">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src={banner} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/80 -z-10"></div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Content */}
      <div className="relative z-10 text-white text-center flex flex-col items-center justify-center h-[80%] px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
          Welcome to <span className="text-sky-400">VibeTune</span>
        </h1>
        <p className="text-lg md:text-2xl pb-4">
          Feel the Rhythm. Find Your Vibe.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-6 ">
          <Link to='/signUp'>
          <button className="mt-6 cursor-pointer w-36 h-17 md:w-40 py-3 bg-sky-900 text-white rounded-xl hover:bg-sky-800 transition">
            Get Started
          </button></Link>
          <Link to='/login'>
           <button className="mt-6 cursor-pointer w-36  h-17 md:w-40 py-3 border border-white rounded-xl hover:bg-white hover:text-black transition">
            Login
          </button>
          </Link>
         
        </div>
      </div>
    </div>
  );
};

export default Header;
