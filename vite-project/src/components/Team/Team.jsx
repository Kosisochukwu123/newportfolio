import { useEffect, useState } from "react";
import { usePageReady } from "../../utils/pageReady";
import "./Team.css";

const API = import.meta.env.VITE_API_URL || "/api";

export default function Team() {
  const notifyReady = usePageReady();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/team`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setMembers(d.data);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
        notifyReady();
      });
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
              console.log("Team member:", m);
              console.log("Photo URL:", m.photoUrl);
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
