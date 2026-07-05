import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Skills from "./components/Skills/Skills";
import Projects from "./components/Projects/Projects";
import Collaborations from "./components/Collaborations/Collaborations";
import Contact from "./components/Contact/Contact";
import Team from "./components/Team/Team";
import TeamJoin from "./components/Team/TeamJoin";
import Loader from "./components/Loader/Loader";
import ScrollProgress from "./components/ScrollProgress/ScrollProgress";
import ChatBot from "./components/ChatBot/ChatBot";
import { fetchWithCache } from "./utils/cache";
import { initSmoothScroll, getLenis } from "./utils/smoothScroll";
import "./styles/globals.css";

// const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = import.meta.env.VITE_API_URL || "/api";

function HomeSections({ profile, projects, skills }) {
  return (
    <>
      <Hero profile={profile} />
      <Skills skills={skills} />
      <Collaborations />
      <Projects projects={projects} />
      <About profile={profile} />
    </>
  );
}

// React Router's client-side navigation doesn't auto-scroll to hash
// fragments the way a full page load does. This handles nav links like
// `/#cases` — including when clicked from a different page (e.g. from
// /contact back to a homepage section).
function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.slice(1);
    const timeout = setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;

      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(el, { offset: 0 });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 80);

    return () => clearTimeout(timeout);
  }, [location]);

  return null;
}

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // `dataReady` reflects the REAL fetch state — this is what the Loader
  // waits on. `appReady` becomes true only once the Loader has finished
  // its exit animation, at which point we unmount it entirely.
  const [dataReady, setDataReady] = useState(false);
  const [appReady, setAppReady] = useState(false);

  const [profile, setProfile] = useState({
    name: "Loading...",
    tagline: "",
    heroBio: "",
    terminalLines: [],
    availableForWork: true,
  });

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);

  // Home renders immediately and fetches in the background — the Loader
  // sits on top (opaque) hiding this in-progress state, so by the time
  // it fades away everything underneath is already fully painted.
  // Cache-first: repeat visits within the session skip the network
  // round-trip entirely and resolve near-instantly.
  useEffect(() => {
    Promise.all([
      fetchWithCache("profile", () => fetch(`${API}/profile`).then((r) => r.json())),
      fetchWithCache("projects", () => fetch(`${API}/projects`).then((r) => r.json())),
      fetchWithCache("skills", () => fetch(`${API}/skills`).then((r) => r.json())),
    ])
      .then(([profileRes, projectRes, skillsRes]) => {
        if (profileRes.success) setProfile(profileRes.data);
        if (projectRes.success) setProjects(projectRes.data);
        if (skillsRes.success) setSkills(skillsRes.data);
      })
      .finally(() => setDataReady(true));
  }, []);

  // cursor effect
  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Momentum/inertia scroll — the "heavy glide" feel
  useEffect(() => {
    initSmoothScroll();
  }, []);

  return (
    <div className="app">
      <ScrollProgress />
      <div className="cursor-glow" style={{ left: mousePos.x, top: mousePos.y }} />

      {/* GLOBAL DATA PASSED DOWN */}
      <Navbar profile={profile} />
      <ScrollToHash />

      <Routes>
        <Route
          path="/"
          element={<HomeSections profile={profile} projects={projects} skills={skills} />}
        />
        <Route path="/contact" element={<Contact profile={profile} />} />
        <Route path="/team" element={<Team />} />
        <Route path="/join/:token" element={<TeamJoin />} />
      </Routes>

      <ChatBot />

      {!appReady && (
        <Loader dataReady={dataReady} onComplete={() => setAppReady(true)} />
      )}
    </div>
  );
}
