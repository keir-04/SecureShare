import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { formatDate, formatFileSize } from "../utils/format";
import { getApiError } from "../utils/validation";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [dashboard, usersRes, filesRes, logsRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
        api.get("/admin/files"),
        api.get("/admin/audit-logs"),
      ]);
      setStats(dashboard.data.stats);
      setUsers(usersRes.data.users);
      setFiles(filesRes.data.files);
      setLogs(logsRes.data.logs);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const toggleBlock = async (id) => {
    try {
      await api.patch("/admin/users/" + id + "/block");
      toast.success("User status updated");
      fetchAdminData();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const deleteFile = async (id) => {
    try {
      await api.delete("/admin/files/" + id);
      toast.success("Abusive file record removed");
      fetchAdminData();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  if (loading) return <LoadingSpinner label="Loading admin dashboard..." />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Users</p>
          <p className="mt-3 text-3xl font-semibold">{stats.totalUsers}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Files</p>
          <p className="mt-3 text-3xl font-semibold">{stats.totalFiles}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Downloads</p>
          <p className="mt-3 text-3xl font-semibold">{stats.totalDownloads}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Audit events</p>
          <p className="mt-3 text-3xl font-semibold">{stats.totalAuditEvents}</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-lg font-semibold">Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900/70">
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                  </td>
                  <td className="px-4 py-4 capitalize">{user.role}</td>
                  <td className="px-4 py-4">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-4">{user.isBlocked ? "Blocked" : "Active"}</td>
                  <td className="px-4 py-4">
                    <button className={user.isBlocked ? "btn-secondary" : "btn-danger"} onClick={() => toggleBlock(user._id)}>
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-lg font-semibold">Files</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900/70">
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3">File</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Downloads</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {files.map((file) => (
                <tr key={file._id}>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{file.originalName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{file.visibility}</p>
                  </td>
                  <td className="px-4 py-4">{file.owner?.email || "Unknown"}</td>
                  <td className="px-4 py-4">{formatFileSize(file.size)}</td>
                  <td className="px-4 py-4">{file.downloadCount}</td>
                  <td className="px-4 py-4">
                    <button className="btn-danger" onClick={() => deleteFile(file._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold">Audit log</h2>
        <div className="mt-4 space-y-3">
          {logs.slice(0, 20).map((log) => (
            <div key={log._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-semibold capitalize">{log.action.replace(/_/g, " ")}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {log.user?.email || "System"} • {formatDate(log.timestamp)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
