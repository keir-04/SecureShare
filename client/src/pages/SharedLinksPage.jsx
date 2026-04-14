import { useEffect, useState } from "react";
import { Copy, Shield, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import EmptyState from "../components/shared/EmptyState";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { formatDate, formatFileSize } from "../utils/format";
import { getApiError } from "../utils/validation";

const SharedLinksPage = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/share/mine");
      setLinks(data.shareLinks);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCopy = async (url) => {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  const disableLink = async (id) => {
    try {
      await api.delete("/share/" + id);
      toast.success("Link disabled");
      fetchLinks();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  if (loading) return <LoadingSpinner label="Loading shared files..." />;

  if (!links.length) {
    return (
      <EmptyState
        title="No share links yet"
        description="Create a secure link from the dashboard to see it here."
      />
    );
  }

  return (
    <div className="space-y-4">
      {links.map((link) => (
        <div key={link.id} className="card p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{link.file?.originalName || "Deleted file"}</h2>
                <span
                  className={
                    "rounded-full px-3 py-1 text-xs font-semibold " +
                    (link.isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300")
                  }
                >
                  {link.isActive ? "Active" : "Inactive"}
                </span>
                {link.isPasswordProtected ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                    <Shield size={14} />
                    Password protected
                  </span>
                ) : null}
              </div>
              <p className="mt-3 break-all text-sm text-slate-600 dark:text-slate-400">{link.frontendUrl}</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Size: {formatFileSize(link.file?.size)} • Downloads: {link.file?.downloadCount ?? 0} • Expires: {formatDate(link.expiresAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="btn-secondary gap-2" onClick={() => handleCopy(link.frontendUrl)}>
                <Copy size={16} />
                Copy
              </button>
              <button className="btn-danger gap-2" onClick={() => disableLink(link.id)}>
                <Trash2 size={16} />
                Disable
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SharedLinksPage;
