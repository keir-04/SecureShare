import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import FileFilters from "../components/files/FileFilters";
import FileTable from "../components/files/FileTable";
import UploadModal from "../components/files/UploadModal";
import ShareLinkModal from "../components/files/ShareLinkModal";
import DeleteConfirmModal from "../components/files/DeleteConfirmModal";
import RenameFileModal from "../components/files/RenameFileModal";
import EmptyState from "../components/shared/EmptyState";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import Pagination from "../components/shared/Pagination";
import { getApiError } from "../utils/validation";

const DashboardPage = () => {
  const [filters, setFilters] = useState({ search: "", type: "", sort: "latest", page: 1, limit: 8 });
  const [files, setFiles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [shareFile, setShareFile] = useState(null);
  const [deleteFile, setDeleteFile] = useState(null);
  const [renameFile, setRenameFile] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const summary = useMemo(
    () => ({
      totalFiles: files.length,
      totalDownloads: files.reduce((total, item) => total + item.downloadCount, 0),
      sharedFiles: files.filter((item) => item.visibility === "shared").length,
    }),
    [files]
  );

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/files", { params: filters });
      setFiles(data.files);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [filters.page, filters.limit, filters.search, filters.sort, filters.type]);

  const toggleVisibility = async (file) => {
    try {
      await api.put("/files/" + file._id, {
        visibility: file.visibility === "private" ? "shared" : "private",
      });
      toast.success("Visibility updated");
      fetchFiles();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const handleDelete = async () => {
    if (!deleteFile) return;
    try {
      setActionLoading(true);
      await api.delete("/files/" + deleteFile._id);
      toast.success("File deleted");
      setDeleteFile(null);
      fetchFiles();
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRename = async (newName) => {
    if (!renameFile) return;
    try {
      setActionLoading(true);
      await api.put("/files/" + renameFile._id, { originalName: newName });
      toast.success("File renamed");
      setRenameFile(null);
      fetchFiles();
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownload = (file) => {
    window.open((import.meta.env.VITE_API_URL || "http://localhost:5000/api") + "/files/" + file._id + "/download", "_blank");
  };

  if (loading) {
    return <LoadingSpinner label="Loading your files..." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Files in current view</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{summary.totalFiles}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total downloads</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{summary.totalDownloads}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Currently shared</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{summary.sharedFiles}</p>
        </div>
      </div>

      <FileFilters filters={filters} setFilters={setFilters} onUploadClick={() => setUploadOpen(true)} />

      {files.length ? (
        <>
          <FileTable
            files={files}
            onRename={setRenameFile}
            onToggleVisibility={toggleVisibility}
            onShare={setShareFile}
            onDelete={setDeleteFile}
            onDownload={handleDownload}
          />
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} />
        </>
      ) : (
        <EmptyState
          title="No files found"
          description="Upload your first document or adjust your filters to see matching files."
          action={
            <button className="btn-primary" onClick={() => setUploadOpen(true)}>
              Upload your first file
            </button>
          }
        />
      )}

      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} onUploaded={fetchFiles} />
      <ShareLinkModal file={shareFile} isOpen={Boolean(shareFile)} onClose={() => setShareFile(null)} onCreated={fetchFiles} />
      <DeleteConfirmModal file={deleteFile} isOpen={Boolean(deleteFile)} onClose={() => setDeleteFile(null)} onConfirm={handleDelete} loading={actionLoading} />
      <RenameFileModal file={renameFile} isOpen={Boolean(renameFile)} onClose={() => setRenameFile(null)} onSubmit={handleRename} loading={actionLoading} />
    </div>
  );
};

export default DashboardPage;
