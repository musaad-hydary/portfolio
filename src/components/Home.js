import React from "react";
import HomeArt from "../assets/home_art.png";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div
        className={
          "min-h-screen bg-no-repeat bg-cover bg-center bg-fixed h-full"
        }
        style={{ backgroundImage: `url(${HomeArt})` }}
      >

        <h1 className="mb-8 px-8 pt-48 text-3xl font-extrabold text-white lg:pt-60 md:text-5xl lg:text-6xl">
          welcome to <br />
          my world
          <span className="animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
            ...
          </span>
        </h1>
        <Link to="/projects">
          <a className="mx-8 relative inline-flex items-center justify-start inline-block px-5 py-3 overflow-hidden font-bold group">
            <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
            <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-white opacity-100 group-hover:-translate-x-8"></span>
            <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-[#19147A]">
              ENTER
            </span>
            <span className="absolute inset-0 border-2 border-white"></span>
          </a>
        </Link>
      </div>
      
    </div>
  );
}

export default Home;
