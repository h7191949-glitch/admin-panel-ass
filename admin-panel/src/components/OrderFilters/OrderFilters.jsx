import "./OrderFilters.css";

function OrderFilters({
  search,
  setSearch,
  status,
  setStatus,
}) {
  return (
    <div className="order-filters">

      <div className="order-search">

        <span>⌕</span>

        <input
          type="text"
          placeholder="Search by order ID, customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option>All Statuses</option>
        <option>Delivered</option>
        <option>Pending</option>
        <option>Shipped</option>
        <option>Cancelled</option>
        <option>Processing</option>
      </select>

    </div>
  );
}

export default OrderFilters;