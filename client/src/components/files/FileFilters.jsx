const FileFilters = ({ filters, setFilters, onUploadClick }) => {
  return (
    <div className="card p-4">
      <div className="grid gap-4 md:grid-cols-4">
        <input
          className="input"
          placeholder="Search by file name"
          value={filters.search}
          onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value, page: 1 }))}
        />
        <select
          className="input"
          value={filters.type}
          onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value, page: 1 }))}
        >
          <option value="">All types</option>
          <option value="image">Images</option>
          <option value="application/pdf">PDF</option>
          <option value="text">Text</option>
          <option value="application">Documents & archives</option>
        </select>
        <select
          className="input"
          value={filters.sort}
          onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="mostDownloaded">Most downloaded</option>
        </select>
        <button className="btn-primary" onClick={onUploadClick}>
          Upload File
        </button>
      </div>
    </div>
  );
};

export default FileFilters;
