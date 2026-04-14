import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { getApiError, validationMessages } from "../../utils/validation";
import Modal from "../shared/Modal";

const ShareLinkModal = ({ file, isOpen, onClose, onCreated }) => {
  const [expiresInHours, setExpiresInHours] = useState(24);
  const [password, setPassword] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post("/share/" + file._id, {
        expiresInHours,
        password: password || undefined,
      });
      setGeneratedLink(data.shareLink.frontendUrl);
      onCreated();
      toast.success("Share link created");
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedLink);
    toast.success("Link copied to clipboard");
  };

  return (
    <Modal title={"Create share link for " + (file?.originalName || "")} isOpen={isOpen} onClose={onClose}>
      <form className="space-y-4" onSubmit={handleGenerate}>
        <div>
          <label className="label">Expires in hours</label>
          <input
            className="input"
            type="number"
            min="1"
            max="720"
            value={expiresInHours}
            onChange={(event) => setExpiresInHours(event.target.value)}
          />
        </div>
        <div>
          <label className="label">Optional password</label>
          <input
            className="input"
            type="password"
            placeholder="Leave empty for no password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{validationMessages.sharePassword}</p>
        </div>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Generating..." : "Generate secure link"}
        </button>
      </form>
      {generatedLink ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <p className="mb-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300">Ready to share</p>
          <p className="break-all text-sm text-emerald-700 dark:text-emerald-400">{generatedLink}</p>
          <button className="btn-secondary mt-4" onClick={handleCopy} type="button">
            Copy link
          </button>
        </div>
      ) : null}
    </Modal>
  );
};

export default ShareLinkModal;
