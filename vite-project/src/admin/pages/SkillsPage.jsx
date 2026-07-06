import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";

const GROUPS = ["Business Solutions", "Design", "Development", "Infrastructure"];

export default function SkillsPage() {
  const { show, toast } = useToast();
  const [skills, setSkills]   = useState([]);
  const [newSkill, setNewSkill] = useState({ name: "", group: "Business Solutions" });
  const [adding, setAdding]   = useState(false);

  const load = () => api.get("/skills").then((d) => setSkills(d.data));
  useEffect(() => { load(); }, []);

  const grouped = GROUPS.reduce((acc, g) => {
    acc[g] = skills.filter((s) => s.group === g);
    return acc;
  }, {});

  const addSkill = async () => {
    if (!newSkill.name.trim()) return;
    setAdding(true);
    try {
      await api.post("/skills", { ...newSkill, order: skills.filter(s => s.group === newSkill.group).length });
      setNewSkill({ name: "", group: "Business Solutions" });
      await load();
      show("Skill added");
    } catch (e) { show(e.message, "error"); }
    finally { setAdding(false); }
  };

  const deleteSkill = async (id) => {
    try {
      await api.delete(`/skills/${id}`);
      await load();
      show("Skill removed");
    } catch (e) { show(e.message, "error"); }
  };

  return (
    <div>
      <Toast toast={toast} />
      <div className="page-header">
        <h1>Skills</h1>
        <p>Manage the tech stack displayed on your portfolio.</p>
      </div>

      {/* Add skill */}
      <div className="admin-card">
        <div className="admin-card-title">+ Add a Skill</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.75rem", alignItems: "flex-end" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Skill Name</label>
            <input className="form-input" value={newSkill.name}
              onChange={(e) => setNewSkill((s) => ({ ...s, name: e.target.value }))}
              placeholder="e.g. Vue.js"
              onKeyDown={(e) => e.key === "Enter" && addSkill()} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Category</label>
            <select className="form-select" value={newSkill.group}
              onChange={(e) => setNewSkill((s) => ({ ...s, group: e.target.value }))}>
              {GROUPS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <button className="btn-admin btn-save" onClick={addSkill} disabled={adding || !newSkill.name.trim()}>
            {adding ? "Adding…" : "Add"}
          </button>
        </div>
      </div>

      {/* Skills by group */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {GROUPS.map((group) => (
          <div className="admin-card" key={group} style={{ marginBottom: 0 }}>
            <div className="admin-card-title" style={{ marginBottom: "0.75rem" }}>
              <span style={{ color: "var(--accent)" }}>◈</span> {group}
              <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 400 }}>
                {grouped[group].length} skills
              </span>
            </div>
            {grouped[group].length === 0
              ? <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>No skills yet</p>
              : grouped[group].map((skill) => (
                  <div key={skill._id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "0.5rem 0", borderBottom: "1px solid var(--border)",
                  }}>
                    <span style={{ fontSize: "0.875rem" }}>{skill.name}</span>
                    <button
                      className="btn-admin btn-danger"
                      style={{ padding: "0.25rem 0.6rem", fontSize: "0.72rem" }}
                      onClick={() => deleteSkill(skill._id)}
                    >✕</button>
                  </div>
                ))
            }
          </div>
        ))}
      </div>
    </div>
  );
}