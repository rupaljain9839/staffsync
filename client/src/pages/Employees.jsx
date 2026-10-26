import { useState } from "react";
import api, { useLoad, fmt, errMsg } from "../api";

const empty = { name: "", email: "", phone: "", department: "", designation: "", role: "employee", joiningDate: "", address: "" };
const text = ["name", "email", "phone", "department", "designation", "address"];

export default function Employees() {
  const [list, load] = useLoad("/employees");
  const [f, setF] = useState(empty);
  const [id, setId] = useState(null);
  const [msg, setMsg] = useState("");
  const set = k => e => setF({ ...f, [k]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      id ? await api.put(`/employees/${id}`, f) : await api.post("/employees", f);
      setF(empty); setId(null); setMsg(""); load();
    } catch (x) { setMsg(errMsg(x)); }
  };
  const edit = emp => {
    setId(emp._id);
    const v = Object.fromEntries(Object.keys(empty).map(k => [k, emp[k] || ""]));
    setF({ ...v, joiningDate: v.joiningDate ? String(v.joiningDate).slice(0, 10) : "" });
  };
  const del = async i => {
    if (!confirm("Delete this employee?")) return;
    try { await api.delete(`/employees/${i}`); load(); } catch (x) { alert(errMsg(x)); }
  };

  return (
    <>
      <h4>Manage Employees</h4>
      <form className="card card-body mb-4" onSubmit={submit}>
        <div className="row g-2">
          {text.map(k => (
            <div className="col-md-4" key={k}>
              <input className="form-control" placeholder={k[0].toUpperCase() + k.slice(1)} required={k === "name" || k === "email"}
                type={k === "email" ? "email" : "text"} value={f[k]} onChange={set(k)} />
            </div>
          ))}
          <div className="col-md-4">
            <select className="form-select" value={f.role} onChange={set("role")}>
              <option value="employee">Employee</option><option value="manager">Manager</option><option value="hr">HR</option>
            </select>
          </div>
          <div className="col-md-4"><input type="date" className="form-control" value={f.joiningDate} onChange={set("joiningDate")} /></div>
        </div>
        {msg && <div className="text-danger mt-2">{msg}</div>}
        {!id && <small className="text-muted mt-2">New employees get the default password <code>Welcome@123</code>.</small>}
        <div className="mt-3">
          <button className="btn btn-primary me-2">{id ? "Update" : "Add"} Employee</button>
          {id && <button type="button" className="btn btn-secondary" onClick={() => { setId(null); setF(empty); }}>Cancel</button>}
        </div>
      </form>
      <div className="table-responsive"><table className="table table-striped align-middle">
        <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Designation</th><th>Role</th><th>Joined</th><th></th></tr></thead>
        <tbody>{list.map(e => (
          <tr key={e._id}>
            <td>{e.name}</td><td>{e.email}</td><td>{e.department}</td><td>{e.designation}</td>
            <td className="text-capitalize">{e.role}</td><td>{fmt(e.joiningDate)}</td>
            <td className="text-nowrap">
              <button className="btn btn-sm btn-outline-primary me-1" onClick={() => edit(e)}>Edit</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => del(e._id)}>Delete</button>
            </td>
          </tr>
        ))}</tbody>
      </table></div>
    </>
  );
}
