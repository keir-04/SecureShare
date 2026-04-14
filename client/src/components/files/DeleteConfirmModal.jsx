import Modal from "../shared/Modal";

const DeleteConfirmModal = ({ file, isOpen, onClose, onConfirm, loading }) => {
  return (
    <Modal title="Delete file" isOpen={isOpen} onClose={onClose}>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        This will permanently delete <span className="font-semibold text-slate-900 dark:text-white">{file?.originalName}</span>.
      </p>
      <div className="mt-6 flex gap-3">
        <button className="btn-secondary flex-1" onClick={onClose}>
          Cancel
        </button>
        <button className="btn-danger flex-1" onClick={onConfirm} disabled={loading}>
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
