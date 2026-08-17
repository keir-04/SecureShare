import { useRef, useState } from "react";
import axios from "axios";
import {
  FaUpload,
  FaFileAlt,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const fileRef = useRef();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [filename, setFilename] = useState("");

  const selectFile = () => {
    if (fileRef.current.files.length > 0) {
      setFilename(fileRef.current.files[0].name);
    }
  };

  const upload = async () => {
    if (!fileRef.current.files.length) {
      alert("Please select a file");
      return;
    }

    const form = new FormData();
    form.append("file", fileRef.current.files[0]);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/files/upload",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message);

      fileRef.current.value = "";
      setFilename("");

      navigate("/files");

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Upload failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center">

      <div className="bg-slate-900 w-[600px] rounded-2xl shadow-xl p-10">

        <div className="text-center">

          <FaCloudUploadAlt
            size={70}
            className="mx-auto text-blue-500"
          />

          <h1 className="text-4xl font-bold mt-4">
            Upload File
          </h1>

          <p className="text-gray-400 mt-2">
            Securely upload your files to SecureShare Pro
          </p>

        </div>

        <div className="mt-10">

          <input
            type="file"
            ref={fileRef}
            onChange={selectFile}
            className="w-full bg-slate-800 rounded-lg p-3"
          />

        </div>

        {filename && (
          <div className="mt-6 bg-slate-800 rounded-lg p-4 flex items-center gap-4">

            <FaFileAlt
              className="text-blue-400"
              size={28}
            />

            <div>

              <h3 className="font-semibold">
                Selected File
              </h3>

              <p className="text-gray-400">
                {filename}
              </p>

            </div>

          </div>
        )}

        <button
          onClick={upload}
          disabled={loading}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg py-4 text-lg font-semibold flex justify-center items-center gap-3 disabled:bg-gray-600"
        >
          <FaUpload />

          {loading ? "Uploading..." : "Upload File"}
        </button>

      </div>

    </div>
  );
}