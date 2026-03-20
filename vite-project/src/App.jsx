import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Skills from "./components/Skills/Skills";
import Projects from "./components/Projects/Projects";
import Contact from "./components/Contact/Contact";
import "./styles/globals.css";

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cursorRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="app">
      <div
        className="cursor-glow"
        style={{ left: mousePos.x, top: mousePos.y }}
      />
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Skills />
        <About />
        <Contact />
      </main>
      <footer className="footer">
        <p>© 2025 · Built with MongoDB · Express · React · Node.js</p>
      </footer>
    </div>
  );
}
