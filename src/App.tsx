import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import QR from "./pages/QR";
import Feed from "./pages/Feed";
import Music from "./pages/Music";

export default function App() {
  return (
    <BrowserRouter>
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
