import { useEffect, useState } from "react";
import api, { fmt, errMsg } from "../api";

export default function Profile() {
  const [emp, setEmp] = useState(null);
  const [f, setF] = useState({ phone: "", address: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/employees/me").then(r => { setEmp(r.data); setF({ phone: r.data?.phone || "", address: r.data?.address || "" }); });
  }, []);

  const save = async e => {
    e.preventDefault();
    try { await api.put("/employees/me", f); setMsg("Profile updated"); } catch (x) { setMsg(errMsg(x)); }
  };
  if (!emp) return <p>No employee record found.</p>;

  return (
    <>
      <h4>My Profile</h4>
      <div className="card card-body mb-3">
        <div><strong>Name:</strong> {emp.name}</div>
        <div><strong>Email:</strong> {emp.email}</div>
        <div><strong>Department:</strong> {emp.department || "-"}</div>
        <div><strong>Designation:</strong> {emp.designation || "-"}</div>
        <div><strong>Joined:</strong> {fmt(emp.joiningDate)}</div>
      </div>
      <form className="card card-body" onSubmit={save}>
        <input className="form-control mb-2" placeholder="Phone" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} />
        <input className="form-control mb-2" placeholder="Address" value={f.address} onChange={e => setF({ ...f, address: e.target.value })} />
        {msg && <div className="text-success mb-2">{msg}</div>}
        <button className="btn btn-primary align-self-start">Save</button>
      </form>
    </>
  );
}
