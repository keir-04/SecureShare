import { useEffect, useState } from "react";
import axios from "axios";
import { FaDownload, FaTrash, FaFileAlt } from "react-icons/fa";

export default function MyFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/files");
      setFiles(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this file?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/files/${id}`);
      loadFiles();
    } catch (err) {
      console.error(err);
      alert("Failed to delete file");
    }
  };

  const download = (id) => {
    window.open(`http://localhost:5000/api/files/download/${id}`, "_blank");
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">My Files</h1>

      {loading ? (
        <h2>Loading...</h2>
      ) : files.length === 0 ? (
        <div className="bg-slate-900 rounded-xl p-10 text-center">
          <FaFileAlt className="text-5xl mx-auto mb-4 text-gray-400" />
          <p>No files uploaded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-slate-900 rounded-xl shadow-lg">
          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-4">File Name</th>
                <th className="p-4">Size</th>
                <th className="p-4">Uploaded</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {files.map((file) => (
                <tr
                  key={file.id}
                  className="border-b border-slate-700 hover:bg-slate-800"
                >
                  <td className="p-4">{file.original_name}</td>

                  <td className="p-4">
                    {(file.file_size / 1024).toFixed(2)} KB
                  </td>

                  <td className="p-4">
                    {new Date(file.uploaded_at).toLocaleString()}
                  </td>

                  <td className="p-4 flex justify-center gap-3">
                    <button
                      onClick={() => download(file.id)}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center gap-2"
                    >
                      <FaDownload />
                      Download
                    </button>

                    <button
                      onClick={() => remove(file.id)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center gap-2"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}