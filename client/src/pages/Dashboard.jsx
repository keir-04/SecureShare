import {
  FaUpload,
  FaFolderOpen,
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <div className="flex justify-between items-center p-8 border-b border-slate-800">
        <div>
          <h1 className="text-4xl font-bold">SecureShare Pro</h1>
          <p className="text-gray-400 mt-2">
            Enterprise Secure File Vault
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg flex items-center gap-2"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 p-8">

        <div className="bg-slate-900 rounded-xl p-6 shadow-lg">
          <FaShieldAlt className="text-4xl text-green-400 mb-4" />
          <h2 className="text-xl font-bold">AES-256 Encryption</h2>
          <p className="text-gray-400 mt-2">
            Military-grade file protection
          </p>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 shadow-lg">
          <FaUpload className="text-4xl text-blue-400 mb-4" />
          <h2 className="text-xl font-bold">Secure Upload</h2>
          <p className="text-gray-400 mt-2">
            Upload and encrypt files securely
          </p>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 shadow-lg">
          <FaFolderOpen className="text-4xl text-yellow-400 mb-4" />
          <h2 className="text-xl font-bold">File Manager</h2>
          <p className="text-gray-400 mt-2">
            View, download and manage files
          </p>
        </div>

      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-8 px-8 pb-8">

        <button
          onClick={() => navigate("/upload")}
          className="bg-blue-600 hover:bg-blue-700 rounded-xl p-10 transition text-left"
        >
          <FaUpload className="text-5xl mb-4" />
          <h2 className="text-3xl font-bold">Upload File</h2>
          <p className="mt-3 text-blue-100">
            Securely upload and encrypt your files.
          </p>
        </button>

        <button
          onClick={() => navigate("/files")}
          className="bg-green-600 hover:bg-green-700 rounded-xl p-10 transition text-left"
        >
          <FaFolderOpen className="text-5xl mb-4" />
          <h2 className="text-3xl font-bold">My Files</h2>
          <p className="mt-3 text-green-100">
            Download, delete and manage uploaded files.
          </p>
        </button>

      </div>
    </div>
  );
}