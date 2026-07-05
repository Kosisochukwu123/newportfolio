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
import ChatBot from "./components/ChatBot/ChatBot";
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

    // Delay slightly so the target route's content has mounted first.
    const timeout = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);

    return () => clearTimeout(timeout);
  }, [location]);

  return null;
}

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  const [profile, setProfile] = useState({
    name: "Loading...",
    tagline: "",
    heroBio: "",
    terminalLines: [],
    availableForWork: true,
  });

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);

  // 🔥 FETCH ALL DATA ONCE
  useEffect(() => {
    Promise.all([
      fetch(`${API}/profile`).then((r) => r.json()),
      fetch(`${API}/projects`).then((r) => r.json()),
      fetch(`${API}/skills`).then((r) => r.json()),
    ])
      .then(([profileRes, projectRes, skillsRes]) => {
        if (profileRes.success) setProfile(profileRes.data);
        if (projectRes.success) setProjects(projectRes.data);
        if (skillsRes.success) setSkills(skillsRes.data);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => setVisible(true), 150);
      });
  }, []);

  // cursor effect
  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="app">
      {loading && <Loader onComplete={() => setLoading(false)} />}

      <div style={{ opacity: visible ? 1 : 0, transition: "0.5s" }}>
        <div
          className="cursor-glow"
          style={{ left: mousePos.x, top: mousePos.y }}
        />

        {/* GLOBAL DATA PASSED DOWN */}
        <Navbar profile={profile} />
        <ScrollToHash />

        <Routes>
          <Route
            path="/"
            element={
              <HomeSections profile={profile} projects={projects} skills={skills} />
            }
          />
          <Route path="/contact" element={<Contact profile={profile} />} />
          <Route path="/team" element={<Team />} />
          <Route path="/join/:token" element={<TeamJoin />} />
        </Routes>

        <ChatBot />
      </div>
    </div>
  );
}