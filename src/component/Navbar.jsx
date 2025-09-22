import React, { useState } from "react";
import logo from "/public/logo1.png";
import { Link } from "react-router-dom";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 py-4 relative ">
      {/* Logo */}
      <div id="logo">
        <a href="#">
          <img className="w-32 md:w-40" src={logo} alt="Logo" />
        </a>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex text-white gap-10 text-2xl">
        <li className="hover:text-sky-400 cursor-pointer">Home</li>
        <li className="hover:text-sky-400 cursor-pointer"><a href="#about">About</a></li>
        <li className="hover:text-sky-400 cursor-pointer"><a href="#discover">Discover</a></li>
        <li className="hover:text-sky-400 cursor-pointer"><a href="#contact">Contact</a></li>
      </ul>

      {/* Login Button (Desktop) */}
      <div className="hidden md:block">
         <Link to='/login'>
        <button className="w-30 h-15 bg-sky-400 text-2xl rounded-xl cursor-pointer px-6 py-2 hover:bg-sky-500 transition mr-4">
          LogIn
        </button>
        </Link>
      </div>

      {/* Hamburger Button (Mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-3xl text-white focus:outline-none"
      >
        {isOpen ? <span>&times;</span> : <span>&#9776;</span>}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-23 left-0 w-[50%] bg-gray-900 pb-7 text-white flex flex-col items-center gap-6 py-6 md:hidden z-50">
          <ul className="flex flex-col gap-6 text-2xl">
            <li className="hover:text-sky-400 cursor-pointer">Home</li>
            <li className="hover:text-sky-400 cursor-pointer"><a href="#about">About</a></li>
            <li className="hover:text-sky-400 cursor-pointer"><a href="#discover">Discover</a></li>
            <li className="hover:text-sky-400 cursor-pointer"><a href="#contact">Contact</a></li>
          </ul>
          <Link to='/login'>
          <button className="w-30 h-15 bg-sky-400 text-2xl rounded-xl cursor-pointer ">
            LogIn 
          </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
