import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { getApiError } from "../../utils/validation";
import Modal from "../shared/Modal";

const UploadModal = ({ isOpen, onClose, onUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [visibility, setVisibility] = useState("private");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      toast.error("Please choose a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("visibility", visibility);

    try {
      setLoading(true);
      await api.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("File uploaded successfully");
      setSelectedFile(null);
      setVisibility("private");
      onUploaded();
      onClose();
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Upload a file" isOpen={isOpen} onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="label">Choose file</label>
          <input className="input" type="file" onChange={(event) => setSelectedFile(event.target.files?.[0] || null)} />
        </div>
        <div>
          <label className="label">Visibility</label>
          <select className="input" value={visibility} onChange={(event) => setVisibility(event.target.value)}>
            <option value="private">Private</option>
            <option value="shared">Shared</option>
          </select>
        </div>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Uploading..." : "Upload file"}
        </button>
      </form>
    </Modal>
  );
};

export default UploadModal;
