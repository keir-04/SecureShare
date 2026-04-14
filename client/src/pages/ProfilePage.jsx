import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/format";
import { getApiError, validationMessages } from "../utils/validation";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      name: user?.name || "",
      email: user?.email || "",
    }));
  }, [user]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get("/audit-logs/me");
        setLogs(data.logs);
      } catch (error) {
        toast.error(getApiError(error));
      }
    };

    fetchLogs();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.put("/users/profile", form);
      setUser(data.user);
      setForm((current) => ({ ...current, currentPassword: "", newPassword: "" }));
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="card p-6">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Profile settings</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{validationMessages.name}</p>
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{validationMessages.email}</p>
          </div>
          <div>
            <label className="label">Current password</label>
            <input
              className="input"
              type="password"
              value={form.currentPassword}
              onChange={(event) => setForm((current) => ({ ...current, currentPassword: event.target.value }))}
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{validationMessages.currentPassword}</p>
          </div>
          <div>
            <label className="label">New password</label>
            <input
              className="input"
              type="password"
              value={form.newPassword}
              onChange={(event) => setForm((current) => ({ ...current, newPassword: event.target.value }))}
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{validationMessages.password}</p>
          </div>
          <button className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent activity</h2>
        <div className="mt-6 space-y-3">
          {logs.slice(0, 8).map((log) => (
            <div key={log._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-medium capitalize text-slate-900 dark:text-white">{log.action.replace(/_/g, " ")}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{formatDate(log.timestamp)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
