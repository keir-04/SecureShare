import { Download, Link2, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { formatDate, formatFileSize, toMimeLabel } from "../../utils/format";

const FileTable = ({ files, onRename, onToggleVisibility, onShare, onDelete, onDownload }) => {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-900/70">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <th className="px-4 py-3">File</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Visibility</th>
              <th className="px-4 py-3">Downloads</th>
              <th className="px-4 py-3">Uploaded</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm dark:divide-slate-800">
            {files.map((file) => (
              <tr key={file._id} className="align-top">
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-900 dark:text-white">{file.originalName}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{file.mimeType}</p>
                </td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{toMimeLabel(file.mimeType)}</td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{formatFileSize(file.size)}</td>
                <td className="px-4 py-4">
                  <span
                    className={
                      "rounded-full px-3 py-1 text-xs font-semibold " +
                      (file.visibility === "shared"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300")
                    }
                  >
                    {file.visibility}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{file.downloadCount}</td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{formatDate(file.createdAt)}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button className="btn-secondary gap-2 px-3 py-2" onClick={() => onDownload(file)}>
                      <Download size={16} />
                      Download
                    </button>
                    <button className="btn-secondary gap-2 px-3 py-2" onClick={() => onRename(file)}>
                      <Pencil size={16} />
                      Rename
                    </button>
                    <button className="btn-secondary gap-2 px-3 py-2" onClick={() => onToggleVisibility(file)}>
                      <RefreshCw size={16} />
                      Toggle
                    </button>
                    <button className="btn-secondary gap-2 px-3 py-2" onClick={() => onShare(file)}>
                      <Link2 size={16} />
                      Share
                    </button>
                    <button className="btn-danger gap-2 px-3 py-2" onClick={() => onDelete(file)}>
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileTable;
