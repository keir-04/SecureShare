import { useEffect, useState } from "react";
import Modal from "../shared/Modal";

const RenameFileModal = ({ file, isOpen, onClose, onSubmit, loading }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(file?.originalName || "");
  }, [file]);

  return (
    <Modal title="Rename file" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="label">New file name</label>
          <input className="input" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <button className="btn-primary w-full" onClick={() => onSubmit(name)} disabled={loading}>
          {loading ? "Saving..." : "Save name"}
        </button>
      </div>
    </Modal>
  );
};

export default RenameFileModal;
