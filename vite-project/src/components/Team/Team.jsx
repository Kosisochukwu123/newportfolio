import { useEffect, useState } from "react";
import "./Team.css";

const API = import.meta.env.VITE_API_URL || "/api";

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/team`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setMembers(d.data);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="team" className="team-section">
      <div className="container">
        <p className="section-label">05. Team</p>
        <h2 className="section-title">
          The people <span className="accent">behind it</span>
        </h2>

        {loading && <p className="team-status">Loading team…</p>}
        {!loading && error && (
          <p className="team-status">Couldn't load the team — please try refreshing.</p>
        )}
        {!loading && !error && members.length === 0 && (
          <p className="team-status">Team page coming soon.</p>
        )}

        {!loading && !error && members.length > 0 && (
          <div className="team-grid">
            {members.map((m) => (
              <div className="team-card" key={m._id}>
                <div className="team-photo">
                  {m.photoUrl ? (
                    <img src={m.photoUrl} alt={m.name} />
                  ) : (
                    <div className="team-photo-empty" aria-hidden="true">
                      {m.name?.[0] || "?"}
                    </div>
                  )}
                </div>
                <h3 className="team-name">{m.name}</h3>
                <p className="team-role">{m.role}</p>
                {m.bio && <p className="team-bio">{m.bio}</p>}
                {m.socials?.length > 0 && (
                  <div className="team-socials">
                    {m.socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="team-social-link"
                      >
                        {s.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
