import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Loader from "./components/Loader/Loader";
import GatedPage from "./utils/pageReady";
import AdvancedScrollRestoration from "./components/AdvancedScrollRestoration";
import LazySection from "./components/LazySection";
const Services = lazy(() => import("./components/Services/Services"));

import SEO from "./components/SEO/SEO";

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


function HomeSections({ profile, projects, testimonials }) {
  return (
    <>
      <Hero profile={profile} />

      <LazySection>
        <Suspense fallback={null}>
          <Services profile={profile} />
        </Suspense>
      </LazySection>

      <LazySection>
        <Suspense fallback={null}>
          <Projects projects={projects} />
        </Suspense>
      </LazySection>

      <LazySection>
        <Suspense fallback={null}>
          <LightTransition />
        </Suspense>
      </LazySection>

      <LazySection>
        <Suspense fallback={null}>
          <Testimonials testimonials={testimonials} />
        </Suspense>
      </LazySection>

      <LazySection>
        <Suspense fallback={null}>
          <About profile={profile} />
        </Suspense>
      </LazySection>

      <LazySection>
        <Suspense fallback={null}>
          <Footer company={profile} />
        </Suspense>
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

  const [appReady, setAppReady] = useState(() => {
    return sessionStorage.getItem("loaderShown") === "true";
  });

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

  const handleLoaderComplete = () => {
    sessionStorage.setItem("loaderShown", "true");
    setAppReady(true);
  };

  // Custom background glow follows the mouse.
  // The native mouse pointer remains visible.
  useEffect(() => {
    const move = (event) => {
      if (!cursorRef.current) return;

      cursorRef.current.style.transform = `
        translate3d(${event.clientX}px, ${event.clientY}px, 0)
        translate(-50%, -50%)
      `;
    };

    window.addEventListener("pointermove", move, { passive: true });

    return () => {
      window.removeEventListener("pointermove", move);
    };
  }, []);

  // Fetch website data independently.
  // API requests update their sections when ready but never block the homepage.
  useEffect(() => {
    let cancelled = false;

    const loadData = async (key, endpoint, setData) => {
      try {
        const result = await fetchWithCache(key, () => getData(endpoint));

        if (!cancelled && result?.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error(`[GH Studios] Failed to load ${endpoint}:`, error);
      }
    };

    loadData("profile", "profile", setProfile);
    loadData("projects", "projects", setProjects);
    loadData("skills", "skills", setSkills);
    loadData("testimonials", "testimonials", setTestimonials);

    return () => {
      cancelled = true;
    };
  }, []);

  // Initialize smooth scrolling
  useEffect(() => {
    initSmoothScroll();
  }, []);

  return (
    <div className="app">
      <SEO />
      <div ref={cursorRef} className="cursor-glow" aria-hidden="true" />

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
        <Loader dataReady={true} fast onComplete={handleLoaderComplete} />
      )}
    </div>
  );
}
