import React from "react";
import { Link, useLocation } from "react-router-dom";
import Resume from "../assets/MusaadHydary_EngineeringResume.pdf";

import { GiHamburgerMenu } from "react-icons/gi";
import { FaGithubSquare } from "react-icons/fa";
import { FaShareAltSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaPenSquare } from "react-icons/fa";
import { FaEnvelopeSquare } from "react-icons/fa";

function Navbar() {
  const location = useLocation()
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <div className="sticky z-10 top-0  bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 pb-[1px] border-b-4 border-white">
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-[#19147A] mb-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
              <a className="text-2xl font-extrabold leading-relaxed inline-block mr-4 py-2 -mx-4 whitespace-nowrap text-white">
              .{location.pathname}
              </a>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <GiHamburgerMenu />
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="nav-item">
                <Link to="/projects">
                  <a
                    className="px-3 py-2 flex items-center text-3xl font-bold leading-snug text-white hover:opacity-75 transition ease-linear duration-250"
                  >
                    <FaShareAltSquare />
                    <p className="p-2 md:invisible text-sm">./projects</p>
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <a
                  className="px-3 py-2 flex items-center text-3xl font-bold leading-snug text-white hover:opacity-75 transition ease-linear duration-250"
                  href={Resume}
                >
                  <FaPenSquare />
                  <p className="p-2 md:invisible text-sm">./resume</p>
                </a>
              </li>
              <li className="nav-item">
                <Link target="_blank" to="https://github.com/musaad-hydary">
                  <a className="px-3 py-2 flex items-center text-3xl font-bold leading-snug text-white hover:opacity-75 transition ease-linear duration-250">
                    <FaGithubSquare />
                    <p className="p-2 md:invisible text-sm">./github</p>
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  target="_blank"
                  to="https://www.linkedin.com/in/musaad-hydary/"
                >
                  <a className="px-3 py-2 flex items-center text-3xl font-bold leading-snug text-white hover:opacity-75 transition ease-linear duration-250">
                    <FaLinkedin />
                    <p className="p-2 md:invisible text-sm">./linkedin</p>
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/contact">
                  <a
                    className="px-3 py-2 flex items-center text-3xl font-bold leading-snug text-white hover:opacity-75 transition ease-linear duration-250"
                  >
                    <FaEnvelopeSquare />
                    <p className="p-2 md:invisible text-sm">./contact</p>
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
