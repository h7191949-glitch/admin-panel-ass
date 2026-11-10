import "./CustomerFilters.css";

function CustomerFilters({
  search,
  setSearch,
  status,
  setStatus,
}) {
  return (
    <div className="customer-filters">

      <div className="customer-search">
        <span>⌕</span>

        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option>All Statuses</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>

    </div>
  );
}

export default CustomerFilters;