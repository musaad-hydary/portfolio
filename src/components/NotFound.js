import React from "react";
import Art404 from "../assets/404_art.png";

import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#19147A]">
      <div
        className={
          "min-h-screen bg-no-repeat bg-cover bg-center bg-fixed h-full"
        }
        style={{ backgroundImage: `url(${Art404})` }}
      >
        <h1 class="mb-4 px-8 pt-12 text-5xl font-extrabold text-white">
          <span class="animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
            ./404 <br />
          </span>
          not found
        </h1>
        <Link to="/">
          <a class="mx-8 relative inline-flex items-center justify-start inline-block px-5 py-3 overflow-hidden font-bold group">
            <span class="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
            <span class="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-white opacity-100 group-hover:-translate-x-8"></span>
            <span class="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-[#19147A]">
              GO BACK
            </span>
            <span class="absolute inset-0 border-2 border-white"></span>
          </a>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
