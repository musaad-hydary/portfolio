import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClipLoader from "react-spinners/ClimbingBoxLoader";

const Home = lazy(() => import("./components/Home.js"));
const Projects = lazy(() => import("./components/Projects.js"));
const Contact = lazy(() => import("./components/Contact.js"));
const NotFound = lazy(() => import("./components/NotFound.js"));

function App() {
  return (
    <div className="min-h-screen bg-[#19147A]">
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen translate-y-[-5%]">
              <ClipLoader
                color={"#FFFFFF"}
                size={30}
                aria-label="ClimbingBoxLoader"
                data-testid="loader"
              />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
