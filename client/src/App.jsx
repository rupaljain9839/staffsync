import { BrowserRouter, Routes, Route, Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Leaves from "./pages/Leaves";
import Attendance from "./pages/Attendance";
import Announcements from "./pages/Announcements";
import Training from "./pages/Training";
import Profile from "./pages/Profile";

const links = {
  hr: [["/", "Dashboard"], ["/employees", "Employees"], ["/leaves", "Leave Requests"], ["/attendance", "Attendance"], ["/announcements", "Announcements"]],
  manager: [["/", "Dashboard"], ["/leaves", "Leave Requests"], ["/training", "Training"], ["/announcements", "Announcements"]],
  employee: [["/", "Dashboard"], ["/leaves", "My Leaves"], ["/attendance", "Attendance"], ["/training", "Training"], ["/profile", "My Profile"], ["/announcements", "Announcements"]]
};

function Shell() {
  const { user, logout } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand fw-bold">StaffSync</span>
          <div className="navbar-nav me-auto flex-row flex-wrap gap-3">
            {links[user.role].map(([to, label]) => (
              <NavLink key={to} to={to} end className="nav-link">{label}</NavLink>
            ))}
          </div>
          <span className="text-light me-3 small">{user.name} ({user.role})</span>
          <button className="btn btn-sm btn-outline-light" onClick={logout}>Logout</button>
        </div>
      </nav>
      <div className="container py-4"><Outlet /></div>
    </>
  );
}

// Blocks pages the current role should not see
function Role({ allow }) {
  const { user } = useAuth();
  return allow.includes(user.role) ? <Outlet /> : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Shell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leaves" element={<Leaves />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/training" element={<Training />} />
          <Route element={<Role allow={["hr"]} />}><Route path="/employees" element={<Employees />} /></Route>
          <Route element={<Role allow={["hr", "employee"]} />}><Route path="/attendance" element={<Attendance />} /></Route>
          <Route element={<Role allow={["employee"]} />}><Route path="/profile" element={<Profile />} /></Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
