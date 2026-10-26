import { useState } from "react";
import { useAuth } from "../AuthContext";
import api, { useLoad, fmt, errMsg } from "../api";

const empty = { title: "", description: "", trainer: "", startDate: "", endDate: "", participants: [] };

export default function Training() {
  const { user } = useAuth();
  const canManage = user.role !== "employee";
  const [list, load] = useLoad("/training");
  const [emps] = useLoad(canManage ? "/employees" : null);
  const [f, setF] = useState(empty);
  const set = k => e => setF({ ...f, [k]: e.target.value });

  const create = async e => {
    e.preventDefault();
    try { await api.post("/training", f); setF(empty); load(); } catch (x) { alert(errMsg(x)); }
  };
  const del = async id => { if (confirm("Delete program?")) { await api.delete(`/training/${id}`); load(); } };

  return (
    <>
      <h4>Training & Development</h4>
      {canManage && (
        <form className="card card-body mb-4" onSubmit={create}>
          <div className="row g-2">
            <div className="col-md-6"><input className="form-control" placeholder="Program title" required value={f.title} onChange={set("title")} /></div>
            <div className="col-md-6"><input className="form-control" placeholder="Trainer" value={f.trainer} onChange={set("trainer")} /></div>
            <div className="col-md-6"><input type="date" className="form-control" value={f.startDate} onChange={set("startDate")} /></div>
            <div className="col-md-6"><input type="date" className="form-control" value={f.endDate} onChange={set("endDate")} /></div>
            <div className="col-12"><input className="form-control" placeholder="Description" value={f.description} onChange={set("description")} /></div>
            <div className="col-12">
              <label className="form-label small text-muted">Participants (Ctrl/Cmd + click for multiple)</label>
              <select multiple className="form-select" value={f.participants}
                onChange={e => setF({ ...f, participants: [...e.target.selectedOptions].map(o => o.value) })}>
                {emps.filter(x => x.role === "employee").map(x => <option key={x._id} value={x.user}>{x.name}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-primary align-self-start mt-3">Create Program</button>
        </form>
      )}
      <div className="row g-3">
        {list.map(t => (
          <div className="col-md-6" key={t._id}><div className="card h-100"><div className="card-body">
            <div className="d-flex justify-content-between"><h6>{t.title}</h6>
              {canManage && <button className="btn btn-sm btn-outline-danger" onClick={() => del(t._id)}>Delete</button>}</div>
            <p className="mb-1">{t.description}</p>
            <small className="text-muted d-block">Trainer: {t.trainer || "-"} · {fmt(t.startDate)} → {fmt(t.endDate)}</small>
            {canManage && <small className="text-muted">Participants: {t.participants.map(p => p.name).join(", ") || "none"}</small>}
          </div></div></div>
        ))}
      </div>
      {!list.length && <p className="text-muted">No training programs.</p>}
    </>
  );
}
