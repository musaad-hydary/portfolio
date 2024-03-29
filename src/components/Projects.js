import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectArt from "../assets/project_art.png";
import RapidCraft from "../assets/rapidcraft.jpg";
import Desire from "../assets/desire.jpg";
import Searcher from "../assets/searcher.jpg";
import Calculator from "../assets/calculator.jpg";
import Bookkeepr from "../assets/bookkeepr.jpg";
import MuuTube from "../assets/muutube.jpg";

function Projects() {
  const project = [
    {
      text: "rapidcraft",
      description:
        "generates a LaTex resume via the ChatGPT API on a NodeJS backend.",
      image: RapidCraft,
      link: "https://devpost.com/software/rapidcraft-ai-powered-resume-generator",
    },
    {
      text: "bookkeepr",
      description:
        "classifies receipts and builds a budget using Python OCR and Firebase.",
      image: Bookkeepr,
      link: "https://github.com/musaad-hydary/Receipts",
    },
    {
      text: "desire",
      description:
        "full-stack NFT wishlist app using the OpenSea API, Moralis, and Metamask.",
      image: Desire,
      link: "https://github.com/PKALXI/desireETH",
    },
    {
      text: "muutube",
      description:
        "full-stack React app leveraging the YouTube API for video searching.",
      image: MuuTube,
      link: "https://github.com/musaad-hydary/youtubeClone",
    },
    {
      text: "searcher",
      description:
        "full-stack React app that uses the OpenSplash API for image searches.",
      image: Searcher,
      link: "https://github.com/musaad-hydary/imageSearch",
    },
    {
      text: "pocket calculator",
      description:
        "full-stack React calculator app for mathematical operations.",
      image: Calculator,
      link: "https://github.com/musaad-hydary/calculator",
    },
  ];
  return (
    <div>
      <Navbar />

      <div
        className={
          "min-h-screen bg-no-repeat bg-cover bg-center bg-fixed h-full"
        }
        style={{ backgroundImage: `url(${ProjectArt})` }}
      >
        <h1 class="pt-8 px-8 pb-2 text-md text-white">
          as a full-stack software developer and digital systems engineer, feel
          free to explore some of my projects
          <span class="animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
            ...
          </span>
        </h1>
        <div className="max-w-[1640px] mx-auto p-6 grid md:grid-cols-2 gap-6">
          {project.map(({ text, description, image, link }) => {
            return (
              <div className="relative" key={text}>
                <div className="absolute w-full h-full bg-black/30 text-white border-4 border-white">
                  <p className="font-bold text-2xl px-4 pt-4">{text} </p>
                  <p className="px-4 pt-2">{description}</p>

                  <a
                    href={link}
                    target="_blank"
                    className="mx-4 my-2 relative inline-flex items-center justify-start inline-block px-5 py-3 overflow-hidden font-bold group"
                  >
                    <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
                    <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-white opacity-100 group-hover:-translate-x-8"></span>
                    <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-[#19147A]">
                      SEE MORE
                    </span>
                    <span className="absolute inset-0 border-2 border-white"></span>
                  </a>
                </div>
                <img
                  className="max-h-[250px] w-full object-cover"
                  src={image}
                  alt={text}
                  loading = "lazy"
                />
              </div>
            );
          })}
        </div>
      </div>
      
      <Footer />
      
    </div>
  );
}

export default Projects;
