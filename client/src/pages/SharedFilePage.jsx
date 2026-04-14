import { useEffect, useState } from "react";
import { Download, LockKeyhole } from "lucide-react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { formatFileSize } from "../utils/format";
import { getApiError } from "../utils/validation";

const SharedFilePage = () => {
  const { token } = useParams();
  const [details, setDetails] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/share/public/" + token, { withCredentials: false });
        setDetails(data);
      } catch (error) {
        toast.error(getApiError(error));
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [token]);

  const handleDownload = async () => {
    try {
      setDownloadLoading(true);
      const response = await api.post(
        "/share/public/" + token + "/download",
        { password: password || undefined },
        { responseType: "blob", withCredentials: false }
      );
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", details.file.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Download started");
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setDownloadLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading shared file..." />;

  if (!details) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="card max-w-lg p-8 text-center">
          <h1 className="text-2xl font-semibold">This shared file is unavailable</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">The link may be invalid, disabled, or expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-xl p-8">
        <div className="mb-6 inline-flex rounded-2xl bg-brand-100 p-3 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
          <LockKeyhole size={22} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{details.file.originalName}</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Size: {formatFileSize(details.file.size)} • Downloads: {details.file.downloadCount}
        </p>
        {details.shareLink.isPasswordProtected ? (
          <div className="mt-6">
            <label className="label">Share password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter the password provided by the sender"
            />
          </div>
        ) : null}
        <button className="btn-primary mt-6 w-full gap-2" onClick={handleDownload} disabled={downloadLoading}>
          <Download size={18} />
          {downloadLoading ? "Preparing..." : "Download file"}
        </button>
      </div>
    </div>
  );
};

export default SharedFilePage;
