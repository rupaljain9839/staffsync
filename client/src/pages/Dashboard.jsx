import { useAuth } from "../AuthContext";
import { useLoad, fmt } from "../api";

const info = {
  hr: "Manage employees, approve leaves, view attendance and post announcements.",
  manager: "Review leave requests and manage training & development programs.",
  employee: "Apply for leave, mark attendance and keep your records up to date."
};
const urls = { hr: ["/employees", "/leaves"], manager: ["/leaves", "/training"], employee: ["/leaves/mine", "/attendance/mine"] };

export default function Dashboard() {
  const { user } = useAuth();
  const [a] = useLoad(urls[user.role][0]);
  const [b] = useLoad(urls[user.role][1]);
  const [ann] = useLoad("/announcements");
  const pending = l => l.filter(x => x.status === "Pending").length;
  const stats = {
    hr: [["Total Employees", a.length], ["Pending Leaves", pending(b)]],
    manager: [["Pending Leave Requests", pending(a)], ["Training Programs", b.length]],
    employee: [["My Pending Leaves", pending(a)], ["Days Attended", b.length]]
  }[user.role];

  return (
    <>
      <h3>Welcome, {user.name} <span className="badge bg-primary text-uppercase fs-6">{user.role} dashboard</span></h3>
      <p className="text-muted">{info[user.role]}</p>
      <div className="row g-3 mb-4">
        {stats.map(([label, n]) => (
          <div className="col-md-4" key={label}>
            <div className="card text-center shadow-sm"><div className="card-body">
              <div className="display-6">{n}</div><div className="text-muted">{label}</div>
            </div></div>
          </div>
        ))}
      </div>
      <h5>Latest Announcements</h5>
      {ann.slice(0, 3).map(x => (
        <div className="card mb-2" key={x._id}><div className="card-body py-2">
          <strong>{x.title}</strong> <small className="text-muted">{fmt(x.createdAt)}</small>
          <div>{x.message}</div>
        </div></div>
      ))}
      {!ann.length && <p className="text-muted">No announcements yet.</p>}
    </>
  );
}
