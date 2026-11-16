import { useEffect, useState } from "react";
import { usePageReady } from "../../utils/pageReady";
import { fetchWithCache } from "../../utils/Cache";
import "./Team.css";
import { cachePublicImages } from "../../utils/offlineImages";

const API = import.meta.env.VITE_API_URL || "/api";

export default function Team() {
  const notifyReady = usePageReady();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadTeam = async () => {
      try {
        const result = await fetchWithCache(
          "team",
          async () => {
            const response = await fetch(`${API}/team`);

            if (!response.ok) {
              throw new Error(`Failed to fetch team: ${response.status}`);
            }

            const data = await response.json();

            if (!data?.success) {
              throw new Error(data?.message || "Failed to load team");
            }

            return data;
          },
          24 * 60 * 60 * 1000,
        );

        if (!cancelled && result?.success) {
          cachePublicImages(result.data || []);
          setMembers(result.data || []);
          setError(false);
        }
      } catch (error) {
        console.error("[GH Studios] Failed to load team:", error);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          notifyReady();
        }
      }
    };

    loadTeam();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="team" className="team-section">
      <div className="container">
        {/* <p className="section-label">
          05. Team
        </p> */}

        <h2 className="section-title">
          Our <span className="accent">Team</span>
        </h2>

        {loading && <p className="team-status">Loading team...</p>}

        {!loading && error && (
          <p className="team-status">Couldn't load team members.</p>
        )}

        {!loading && !error && members.length > 0 && (
          <div className="team-grid">
            {members.map((m) => {
              return (
                <div className="team-card" key={m._id}>
                  <div className="team-image-wrapper">
                    {m.photoUrl ? (
                      <img
                        src={m.photoUrl}
                        alt={m.name}
                        className="team-image"
                      />
                    ) : (
                      <div className="team-image-placeholder">
                        {m.name?.[0] || "?"}
                      </div>
                    )}
                  </div>

                  <div className="team-content">
                    <h3 className="team-name">{m.name}</h3>

                    <p className="team-role">{m.role}</p>

                    {m.bio && <p className="team-bio">{m.bio}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
