import axios from "axios";
import { useEffect, useState } from "react";

const api = axios.create({ baseURL: "/api" });
api.interceptors.request.use(c => {
  const t = localStorage.getItem("token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
export default api;

// GET helper: returns [data, reload]. Pass null to skip.
export function useLoad(url) {
  const [data, setData] = useState([]);
  const load = () => url && api.get(url).then(r => setData(r.data)).catch(() => {});
  useEffect(() => { load(); }, [url]);
  return [data, load];
}

export const fmt = d => (d ? new Date(d).toLocaleDateString() : "-");
export const time = d => (d ? new Date(d).toLocaleTimeString() : "-");
export const badge = { Pending: "warning", Approved: "success", Rejected: "danger" };
export const errMsg = e => e.response?.data?.message || "Something went wrong";
