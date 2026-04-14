import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = ({ onMenuClick, theme, toggleTheme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex items-center justify-between px-4 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button className="btn-secondary px-3 py-2 lg:hidden" onClick={onMenuClick}>
            <Menu size={18} />
          </button>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as</p>
            <h1 className="font-semibold text-slate-900 dark:text-white">{user?.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button className="btn-secondary gap-2 px-3 py-2" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
