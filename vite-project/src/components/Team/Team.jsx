
import { useEffect } from "react";
import { usePageReady } from "../../utils/pageReady";
import "./Team.css";

export default function Team({ members = [], error = false }) {
  const notifyReady = usePageReady();

  useEffect(() => {
    notifyReady();
  }, [notifyReady]);

  return (
    <section id="team" className="team-section">
      <div className="container">
        <h2 className="section-title">
          Our <span className="accent">Team</span>
        </h2>

        {error && (
          <p className="team-status">
            Couldn't load team members.
          </p>
        )}

        {!error && members.length > 0 && (
          <div className="team-grid">
            {members.map((member) => (
              <div className="team-card" key={member._id}>
                <div className="team-image-wrapper">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="team-image"
                    />
                  ) : (
                    <div className="team-image-placeholder">
                      {member.name?.[0] || "?"}
                    </div>
                  )}
                </div>

                <div className="team-content">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>

                  {member.bio && (
                    <p className="team-bio">{member.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!error && members.length === 0 && (
          <p className="team-status">
            Team profiles coming soon.
          </p>
        )}
      </div>
    </section>
  );
}
