import { createContext, useContext, useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";

const PageReadyContext = createContext(() => {});

// Call this inside a gated page once its own data fetch resolves
// (in a .finally(), or immediately on mount if it has nothing to fetch).
export function usePageReady() {
  return useContext(PageReadyContext);
}

// Wrap a route's element with this. The page renders immediately
// underneath (so it can fetch in the background), while the Loader
// sits on top hiding it — same "no black flash" technique used for the
// initial homepage load — until the page calls notifyReady(), or a
// 4s fallback elapses so the app can never get permanently stuck.
export default function GatedPage({ children }) {
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const fallback = setTimeout(() => setReady(true), 4000);
    return () => clearTimeout(fallback);
  }, []);

  const notifyReady = () => setReady(true);

  return (
    <PageReadyContext.Provider value={notifyReady}>
      {children}
      {show && <Loader dataReady={ready} onComplete={() => setShow(false)} />}
    </PageReadyContext.Provider>
  );
}