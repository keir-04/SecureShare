import { Link, NavLink } from "react-router-dom";
import { FolderOpen, LayoutDashboard, Link2, Settings, Shield } from "lucide-react";

const navBase =
  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-slate-800";

const navActive = "bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-200";

const Sidebar = ({ user, open, onClose }) => {
  return (
    <>
      {open ? <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={onClose} /> : null}
      <aside
        className={
          "fixed left-0 top-0 z-40 h-full w-72 border-r border-slate-200 bg-white p-6 transition-transform dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
      >
        <Link to="/dashboard" className="mb-8 block">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-600 p-3 text-white">
              <Shield size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">SecureShare</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Secure team file sharing</p>
            </div>
          </div>
        </Link>

        <nav className="space-y-2">
          <NavLink to="/dashboard" onClick={onClose} className={({ isActive }) => navBase + " " + (isActive ? navActive : "")}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          <NavLink to="/shared-links" onClick={onClose} className={({ isActive }) => navBase + " " + (isActive ? navActive : "")}>
            <Link2 size={18} />
            Shared Files
          </NavLink>
          <NavLink to="/profile" onClick={onClose} className={({ isActive }) => navBase + " " + (isActive ? navActive : "")}>
            <Settings size={18} />
            Profile
          </NavLink>
          {user?.role === "admin" ? (
            <NavLink to="/admin" onClick={onClose} className={({ isActive }) => navBase + " " + (isActive ? navActive : "")}>
              <FolderOpen size={18} />
              Admin Panel
            </NavLink>
          ) : null}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
