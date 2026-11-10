import "./OrderStats.css";

function OrderStats({ orders }) {
  const totalOrders = orders.length;

  const delivered = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const pending = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const cancelled = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  return (
    <div className="order-stats">

      <div className="order-stat-card blue-stat">
        <div className="order-stat-icon">
          🛒
        </div>

        <div>
          <p>Total Orders</p>
          <h3>{totalOrders}</h3>
          <span>↑ 12% from last month</span>
        </div>
      </div>


      <div className="order-stat-card green-stat">
        <div className="order-stat-icon">
          ✓
        </div>

        <div>
          <p>Delivered</p>
          <h3>{delivered}</h3>
          <span>↑ 15% from last month</span>
        </div>
      </div>


      <div className="order-stat-card orange-stat">
        <div className="order-stat-icon">
          ◷
        </div>

        <div>
          <p>Pending</p>
          <h3>{pending}</h3>
          <span>↑ 5% from last month</span>
        </div>
      </div>


      <div className="order-stat-card red-stat">
        <div className="order-stat-icon">
          ×
        </div>

        <div>
          <p>Cancelled</p>
          <h3>{cancelled}</h3>
          <span>↓ 3% from last month</span>
        </div>
      </div>

    </div>
  );
}

export default OrderStats;