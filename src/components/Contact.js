import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactArt from "../assets/contact_art.png";

function Contact() {
  return (
    <div>
      <Navbar />
      <div
        className={
          "min-h-screen bg-no-repeat bg-cover bg-center bg-fixed h-full "
        }
        style={{ backgroundImage: `url(${ContactArt})` }}
      >
    <h1 class="pt-8 px-8 text-md text-white">
      send me a message and i'll get back to you soon
          <span class="animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
            ...
          </span>
</h1>
        <form
          method="POST"
          action="https://getform.io/f/b955fc50-0382-4ab9-bea4-19fcec60d47f"
          className="pt-8 px-8 flex flex-col lg:max-w-[600px]"
        >
          <input
            type="TEXT"
            placeholder="NAME"
            name="NAME"
            className="bg-[#19147A] appearance-none border-2 border-white w-full py-6 px-4 text-white leading-tight focus:outline-none focus:text-white"
            required
          />
          <input
            type="EMAIL"
            placeholder="EMAIL"
            name="EMAIL"
            className="bg-[#19147A] my-4 appearance-none border-2 border-white w-full py-6 px-4 text-white leading-tight focus:outline-none focus:text-white"
            required
          />
          <textarea
            name="MESSAGE"
            rows="10"
            placeholder="MESSAGE"
            className="bg-[#19147A] appearance-none border-2 border-white w-full pt-4 py-16 px-4 text-white leading-tight focus:outline-none focus:text-white"
            required
          />
          <button className="text-left text-[#19147A] border-2 bg-white hover:bg-[#19147A] hover:border-white hover:text-white transition ease-linear duration-250 mt-4 p-4">
            SUBMIT
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;
