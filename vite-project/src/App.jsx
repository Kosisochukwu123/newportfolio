import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Skills from "./components/Skills/Skills";
import Projects from "./components/Projects/Projects";
import Contact from "./components/Contact/Contact";
import Loader from "./components/Loader/Loader";
import "./styles/globals.css";

export default function App() {
  const [mousePos, setMousePos]   = useState({ x: 0, y: 0 });
  const [loading, setLoading]     = useState(true);
  const [visible, setVisible]     = useState(false);

  // Only show loader on very first visit per session
  const hasLoaded = sessionStorage.getItem("portfolio_loaded");

  useEffect(() => {
    if (hasLoaded) {
      setLoading(false);
      setVisible(true);
      return;
    }
    // Preload API data in background while loader plays
    const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    Promise.allSettled([
      fetch(`${API}/profile`),
      fetch(`${API}/projects`),
      fetch(`${API}/skills`),
    ]);
  }, []);

  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const handleLoaderComplete = () => {
    sessionStorage.setItem("portfolio_loaded", "1");
    setLoading(false);
    // Small delay so content fades in after loader fades out
    setTimeout(() => setVisible(true), 100);
  };

  return (
    <div className="app">
      {/* Loader — only on first visit */}
      {loading && !hasLoaded && (
        <Loader onComplete={handleLoaderComplete} />
      )}

      {/* Main content — fades in after loader */}
      <div
        style={{
          opacity:    visible ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <div
          className="cursor-glow"
          style={{ left: mousePos.x, top: mousePos.y }}
        />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <footer className="footer">
          <p>© {new Date().getFullYear()} · Built with MongoDB · Express · React · Node.js</p>
        </footer>
      </div>
    </div>
  );
}
