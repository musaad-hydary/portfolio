import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import QR from "./pages/QR";
import Feed from "./pages/Feed";
import Music from "./pages/Music";

function DiscoDriver() {
  const [active, setActive] = useState(() =>
    document.documentElement.classList.contains("disco-mode")
  );

  useEffect(() => {
    const observer = new MutationObserver(() =>
      setActive(document.documentElement.classList.contains("disco-mode"))
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) {
      document.documentElement.style.filter = "";
      return;
    }
    let hue = 0;
    const id = setInterval(() => {
      hue = (hue + 3) % 360;
      document.documentElement.style.filter = `hue-rotate(${hue}deg) saturate(1.8)`;
      window.dispatchEvent(new CustomEvent("disco-hue", { detail: hue }));
    }, 40);
    return () => {
      clearInterval(id);
      document.documentElement.style.filter = "";
    };
  }, [active]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <DiscoDriver />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/music" element={<Music />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/qr" element={<QR />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
