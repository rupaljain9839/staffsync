import { useAuth } from "../AuthContext";
import api, { useLoad, time, errMsg } from "../api";

export default function Attendance() {
  const { user } = useAuth();
  const hr = user.role === "hr";
  const [list, load] = useLoad(hr ? "/attendance" : "/attendance/mine");
  const mark = async path => {
    try { await api.post(`/attendance/${path}`); load(); } catch (x) { alert(errMsg(x)); }
  };

  return (
    <>
      <h4>{hr ? "Attendance Records" : "My Attendance"}</h4>
      {!hr && (
        <div className="mb-3">
          <button className="btn btn-success me-2" onClick={() => mark("checkin")}>Check In</button>
          <button className="btn btn-warning" onClick={() => mark("checkout")}>Check Out</button>
        </div>
      )}
      <div className="table-responsive"><table className="table table-striped">
        <thead><tr>{hr && <th>Employee</th>}<th>Date</th><th>Check In</th><th>Check Out</th></tr></thead>
        <tbody>{list.map(a => (
          <tr key={a._id}>{hr && <td>{a.user?.name}</td>}<td>{a.date}</td><td>{time(a.checkIn)}</td><td>{time(a.checkOut)}</td></tr>
        ))}</tbody>
      </table></div>
    </>
  );
}
