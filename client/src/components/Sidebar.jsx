import {
  FaHome,
  FaFolder,
  FaShareAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 h-screen text-white p-6">

      <h2 className="text-2xl font-bold text-blue-400">
        SecureShare
      </h2>

      <ul className="mt-10 space-y-6">

        <li className="flex gap-3 items-center cursor-pointer hover:text-blue-400">
          <FaHome /> Dashboard
        </li>

        <li className="flex gap-3 items-center cursor-pointer hover:text-blue-400">
          <FaFolder /> Files
        </li>

        <li className="flex gap-3 items-center cursor-pointer hover:text-blue-400">
          <FaShareAlt /> Shared
        </li>

        <li className="flex gap-3 items-center cursor-pointer hover:text-blue-400">
          <FaCog /> Settings
        </li>

        <li className="flex gap-3 items-center cursor-pointer hover:text-red-400">
          <FaSignOutAlt /> Logout
        </li>

      </ul>

    </div>
  );
}