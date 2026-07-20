import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Skills from "./components/Skills/Skills";
import Loader from "./components/Loader/Loader";
import GatedPage from "./utils/pageReady";
import AdvancedScrollRestoration from "./components/AdvancedScrollRestoration";
import LazySection from "./components/LazySection";

import { fetchWithCache } from "./utils/Cache";
import { initSmoothScroll, getLenis } from "./utils/smoothScroll";

import "./styles/globals.css";

// Lazy-loaded components
const About = lazy(() => import("./components/About/About"));
const Projects = lazy(() => import("./components/Projects/Projects"));
const Testimonials = lazy(
  () => import("./components/Testimonials/Testimonials"),
);
const Footer = lazy(() => import("./components/Footer/Footer"));
const Contact = lazy(() => import("./components/Contact/Contact"));
const Team = lazy(() => import("./components/Team/Team"));
const TeamJoin = lazy(() => import("./components/Team/TeamJoin"));
const Resume = lazy(() => import("./components/Resume/Resume"));
const LightTransition = lazy(
  () => import("./components/LightTransaction/LightTransition"),
);

const API = import.meta.env.VITE_API_URL || "/api";

const getData = (endpoint) =>
  fetch(`${API}/${endpoint}`).then((res) => res.json());

function HomeSections({ profile, projects, skills, testimonials }) {
  return (
    <>
      <Hero profile={profile} />

      <LazySection>
        <Skills skills={skills} />
      </LazySection>

      <LazySection>
        <Projects projects={projects} />
      </LazySection>

      <LazySection>
        <LightTransition />
      </LazySection>

      <LazySection>
        <Testimonials testimonials={testimonials} />
      </LazySection>

      <LazySection>
        <About profile={profile} />
      </LazySection>

      <LazySection>
        <Footer company={profile} />
      </LazySection>
    </>
  );
}

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.substring(1);

    const timer = setTimeout(() => {
      const target = document.getElementById(id);

      if (!target) {
        if (import.meta.env.DEV) {
          console.log(`Couldn't find element: ${id}`);
        }
        return;
      }

      const lenis = getLenis();

      if (lenis) {
        lenis.scrollTo(target, {
          duration: 2.2,
        });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [location]);

  return null;
}

export default function App() {
  const cursorRef = useRef(null);

  const [dataReady, setDataReady] = useState(false);
  const [appReady, setAppReady] = useState(() => {
    return sessionStorage.getItem("loaderShown") === "true";
  });
  const handleLoaderComplete = () => {
  sessionStorage.setItem("loaderShown", "true");
  setAppReady(true);
};
  const [profile, setProfile] = useState({
    name: "Loading...",
    tagline: "",
    heroBio: "",
    terminalLines: [],
    availableForWork: true,
  });

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    Promise.all([
      fetchWithCache("profile", () => getData("profile")),
      fetchWithCache("projects", () => getData("projects")),
      fetchWithCache("skills", () => getData("skills")),
      fetchWithCache("testimonials", () => getData("testimonials")),
    ])
      .then(([profileRes, projectRes, skillsRes, testimonialsRes]) => {
        if (profileRes.success) setProfile(profileRes.data);
        if (projectRes.success) setProjects(projectRes.data);
        if (skillsRes.success) setSkills(skillsRes.data);
        if (testimonialsRes.success) setTestimonials(testimonialsRes.data);
      })
      .finally(() => setDataReady(true));
  }, []);

  useEffect(() => {
    const move = (e) => {
      if (!cursorRef.current) return;

      cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  useEffect(() => {
    initSmoothScroll();
  }, []);

  return (
    <div className="app">
      <div ref={cursorRef} className="cursor-glow" />

      <Navbar profile={profile} />

      <AdvancedScrollRestoration />

      <ScrollToHash />

      <Suspense fallback={null}>
        <Routes>
          <Route
            path="/"
            element={
              <HomeSections
                profile={profile}
                projects={projects}
                skills={skills}
                testimonials={testimonials}
              />
            }
          />

          <Route
            path="/contact"
            element={
              <GatedPage key="contact">
                <Contact profile={profile} />
              </GatedPage>
            }
          />

          <Route
            path="/team"
            element={
              <GatedPage key="team">
                <Team />
              </GatedPage>
            }
          />

          <Route path="/resume" element={<Resume />} />

          <Route path="/join/:token" element={<TeamJoin />} />
        </Routes>
      </Suspense>

      {!appReady && (
        <Loader dataReady={dataReady} onComplete={handleLoaderComplete} />
      )}
    </div>
  );
}
