import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { errMsg } from "../api";

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  if (user) return <Navigate to="/" />;

  const submit = async e => {
    e.preventDefault();
    try { await login(f.email, f.password); nav("/"); } catch (x) { setErr(errMsg(x)); }
  };

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: 100 }}>
      <div className="card shadow-sm"><div className="card-body p-4">
        <h3 className="text-center mb-1">StaffSync</h3>
        <p className="text-center text-muted">Modern human resource management</p>
        {err && <div className="alert alert-danger py-2">{err}</div>}
        <form onSubmit={submit}>
          <input className="form-control mb-3" type="email" placeholder="Email" required
            value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
          <input className="form-control mb-3" type="password" placeholder="Password" required
            value={f.password} onChange={e => setF({ ...f, password: e.target.value })} />
          <button className="btn btn-primary w-100">Login</button>
        </form>
      </div></div>
    </div>
  );
}
