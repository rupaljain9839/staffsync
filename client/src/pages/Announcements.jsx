import { useState } from "react";
import { useAuth } from "../AuthContext";
import api, { useLoad, fmt, errMsg } from "../api";

export default function Announcements() {
  const { user } = useAuth();
  const [list, load] = useLoad("/announcements");
  const [f, setF] = useState({ title: "", message: "" });

  const post = async e => {
    e.preventDefault();
    try { await api.post("/announcements", f); setF({ title: "", message: "" }); load(); } catch (x) { alert(errMsg(x)); }
  };
  const del = async id => { await api.delete(`/announcements/${id}`); load(); };

  return (
    <>
      <h4>Announcements & News</h4>
      {user.role === "hr" && (
        <form className="card card-body mb-4" onSubmit={post}>
          <input className="form-control mb-2" placeholder="Title" required value={f.title} onChange={e => setF({ ...f, title: e.target.value })} />
          <textarea className="form-control mb-2" rows="3" placeholder="Message" required value={f.message} onChange={e => setF({ ...f, message: e.target.value })} />
          <button className="btn btn-primary align-self-start">Post</button>
        </form>
      )}
      {list.map(a => (
        <div className="card mb-2" key={a._id}><div className="card-body">
          <div className="d-flex justify-content-between">
            <h6>{a.title}</h6>
            {user.role === "hr" && <button className="btn btn-sm btn-outline-danger" onClick={() => del(a._id)}>Delete</button>}
          </div>
          <p className="mb-1">{a.message}</p>
          <small className="text-muted">{a.postedBy?.name} · {fmt(a.createdAt)}</small>
        </div></div>
      ))}
      {!list.length && <p className="text-muted">No announcements yet.</p>}
    </>
  );
}
