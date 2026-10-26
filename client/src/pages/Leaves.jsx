import { useState } from "react";
import { useAuth } from "../AuthContext";
import api, { useLoad, fmt, badge, errMsg } from "../api";

export default function Leaves() {
  const { user } = useAuth();
  const reviewer = user.role !== "employee"; // HR & Manager review; Employee applies
  const [list, load] = useLoad(reviewer ? "/leaves" : "/leaves/mine");
  const [f, setF] = useState({ type: "Casual", fromDate: "", toDate: "", reason: "" });

  const apply = async e => {
    e.preventDefault();
    try { await api.post("/leaves", f); setF({ ...f, fromDate: "", toDate: "", reason: "" }); load(); } catch (x) { alert(errMsg(x)); }
  };
  const review = async (id, status) => {
    try { await api.put(`/leaves/${id}/status`, { status }); load(); } catch (x) { alert(errMsg(x)); }
  };

  return (
    <>
      <h4>{reviewer ? "Leave Requests" : "My Leaves"}</h4>
      {!reviewer && (
        <form className="card card-body mb-4" onSubmit={apply}>
          <div className="row g-2">
            <div className="col-md-3">
              <select className="form-select" value={f.type} onChange={e => setF({ ...f, type: e.target.value })}>
                {["Casual", "Sick", "Earned", "Unpaid"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-md-3"><input type="date" required className="form-control" value={f.fromDate} onChange={e => setF({ ...f, fromDate: e.target.value })} /></div>
            <div className="col-md-3"><input type="date" required className="form-control" value={f.toDate} onChange={e => setF({ ...f, toDate: e.target.value })} /></div>
            <div className="col-md-3"><button className="btn btn-primary w-100">Apply</button></div>
            <div className="col-12"><input className="form-control" placeholder="Reason" required value={f.reason} onChange={e => setF({ ...f, reason: e.target.value })} /></div>
          </div>
        </form>
      )}
      <div className="table-responsive"><table className="table table-striped align-middle">
        <thead><tr>{reviewer && <th>Employee</th>}<th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th>{reviewer && <th></th>}</tr></thead>
        <tbody>{list.map(l => (
          <tr key={l._id}>
            {reviewer && <td>{l.user?.name}</td>}
            <td>{l.type}</td><td>{fmt(l.fromDate)}</td><td>{fmt(l.toDate)}</td><td>{l.reason}</td>
            <td><span className={`badge bg-${badge[l.status]}`}>{l.status}</span></td>
            {reviewer && <td className="text-nowrap">{l.status === "Pending" && <>
              <button className="btn btn-sm btn-success me-1" onClick={() => review(l._id, "Approved")}>Approve</button>
              <button className="btn btn-sm btn-danger" onClick={() => review(l._id, "Rejected")}>Reject</button>
            </>}</td>}
          </tr>
        ))}</tbody>
      </table></div>
      {!list.length && <p className="text-muted">No leave records.</p>}
    </>
  );
}
