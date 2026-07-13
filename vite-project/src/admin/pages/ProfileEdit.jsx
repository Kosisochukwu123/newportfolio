import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";

export default function ProfileEdit() {
  const { show, toast } = useToast();

  const [profile, setProfile] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/profile")
      .then((res) => {
        setProfile(res.data.data);
      })
      .catch((err) => {
        show(err.message, "error");
      });
  }, []);


  const set = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };


  const save = async () => {
    setSaving(true);

    try {
      const token = localStorage.getItem("portfolio_token");

      await api.put(
        "/profile",
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      show("Profile updated successfully");

    } catch (err) {
      show(err.message, "error");
    }

    finally {
      setSaving(false);
    }
  };


  return (
    <div>

      <Toast toast={toast}/>


      <div className="page-header">
        <h1>Edit Profile</h1>
        <p>
          Update information displayed across your portfolio.
        </p>
      </div>


      <div className="admin-card">


        <div className="form-group">
          <label className="form-label">
            Name
          </label>

          <input
            className="form-input"
            value={profile.name || ""}
            onChange={(e)=>set("name", e.target.value)}
          />
        </div>



        <div className="form-group">
          <label className="form-label">
            Email
          </label>

          <input
            className="form-input"
            value={profile.email || ""}
            onChange={(e)=>set("email", e.target.value)}
          />
        </div>



        <div className="form-group">
          <label className="form-label">
            Location
          </label>

          <input
            className="form-input"
            value={profile.location || ""}
            onChange={(e)=>set("location", e.target.value)}
          />
        </div>



        <div className="form-group">
          <label className="form-label">
            Tagline
          </label>

          <input
            className="form-input"
            value={profile.tagline || ""}
            onChange={(e)=>set("tagline", e.target.value)}
          />
        </div>



        <div className="form-group">
          <label className="form-label">
            Hero Bio
          </label>

          <textarea
            className="form-textarea"
            value={profile.heroBio || ""}
            onChange={(e)=>set("heroBio", e.target.value)}
          />
        </div>



        <div className="form-group">
          <label className="form-label">
            About Bio
          </label>

          <textarea
            className="form-textarea"
            value={profile.aboutBio || ""}
            onChange={(e)=>set("aboutBio", e.target.value)}
          />
        </div>



        <button
          className="btn-admin btn-save"
          onClick={save}
          disabled={saving}
        >
          {
            saving 
            ? "Saving..."
            : "Save Profile"
          }
        </button>


      </div>

    </div>
  );
}