
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Skills from "./components/Skills/Skills";
import Loader from "./components/Loader/Loader";
import GatedPage from "./utils/pageReady";
import AdvancedScrollRestoration from "./components/AdvancedScrollRestoration";
import LazySection from "./components/LazySection";

import { initSmoothScroll, getLenis } from "./utils/smoothScroll";

import "./styles/globals.css";

// Lazy-loaded components
const Services = lazy(() => import("./components/Services/Services"));
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

function HomeSections({
  profile,
  projects,
  skills,
  testimonials,
}) {
  return (
    <>
      <Hero profile={profile} />

      <LazySection>
        <Skills skills={skills} />
      </LazySection>

      <LazySection>
        <Services />
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

export default function App({ initialData = {} }) {
  const cursorRef = useRef(null);

  // Data has already been retrieved by the React Router loader.
  const profile = initialData.profile || {
    name: "GH Studios",
    tagline: "",
    heroBio: "",
    terminalLines: [],
    availableForWork: true,
    socials: [],
  };

  const projects = initialData.projects || [];
  const skills = initialData.skills || [];
  const testimonials = initialData.testimonials || [];
  const team = initialData.team || [];

  // The route loader has completed before this component renders.
  const [dataReady] = useState(true);

  // Always begin with the same state on server and browser.
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("loaderShown") === "true") {
        setAppReady(true);
      }
    } catch {
      // Continue normally if sessionStorage is unavailable.
    }
  }, []);

  const handleLoaderComplete = () => {
    try {
      sessionStorage.setItem("loaderShown", "true");
    } catch {
      // The loader can still complete without sessionStorage.
    }

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

    window.addEventListener("pointermove", move, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", move);
    };
  }, []);

  // Initialize smooth scrolling.
  useEffect(() => {
    initSmoothScroll();
  }, []);

  return (
    <div className="app">
      <div
        ref={cursorRef}
        className="cursor-glow"
        aria-hidden="true"
      />

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
                <Team members={team} />
              </GatedPage>
            }
          />

          <Route path="/resume" element={<Resume />} />

          <Route
            path="/join/:token"
            element={<TeamJoin />}
          />
        </Routes>
      </Suspense>

      {!appReady && (
        <Loader
          dataReady={dataReady}
          onComplete={handleLoaderComplete}
        />
      )}
    </div>
  );
}
