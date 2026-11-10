
import { useState } from "react";
import "./OrderTable.css";

function OrderTable({ orders, onDelete, onUpdateStatus }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const getStatusClass = (status) =>
    status.toLowerCase().replaceAll(" ", "-");

  const handleEdit = () => {
    alert("Edit Order functionality will be connected next.");
    setOpenMenu(null);
  };

  const handleUpdateStatus = (order) => {
    const newStatus = window.prompt(
      "Enter new status: Pending, Processing, Shipped, Delivered, Cancelled",
      order.status
    );

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!newStatus) {
      setOpenMenu(null);
      return;
    }

    if (!allowedStatuses.includes(newStatus)) {
      alert("Invalid status. Please enter a valid order status.");
      setOpenMenu(null);
      return;
    }

    onUpdateStatus(order, newStatus);
    setOpenMenu(null);
  };

  const handleDelete = (order) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${order.orderId}?`
    );

    if (confirmDelete) {
      onDelete(order);

      if (selectedOrder?.id === order.id) {
        setSelectedOrder(null);
      }
    }

    setOpenMenu(null);
  };

  return (
    <>
      <div className="order-table-wrapper">
        <div className="order-table">
          <div className="order-row order-table-header">
            <span>□</span>
            <span>Order ID</span>
            <span>Customer</span>
            <span>Products</span>
            <span>Total Amount</span>
            <span>Payment Method</span>
            <span>Status</span>
            <span>Order Date</span>
            <span>Actions</span>
          </div>

          {orders.length > 0 ? (
            orders.map((order) => (
              <div className="order-row" key={order.id}>
                <span className="order-checkbox">□</span>

                <strong className="order-id">{order.orderId}</strong>

                <div className="customer-info">
                  <div className="customer-avatar">
                    {order.customer.charAt(0)}
                  </div>

                  <div>
                    <strong>{order.customer}</strong>
                    <span>{order.email}</span>
                  </div>
                </div>

                <div className="order-products">
                  <span className="product-mini">
                    {order.productIcon}
                  </span>
                  <span className="more-products">
                    {order.products} items
                  </span>
                </div>

                <strong className="order-total">
                  ${order.total.toFixed(2)}
                </strong>

                <span className="payment-method">{order.payment}</span>

                <span>
                  <span className={`order-status ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </span>

                <div className="order-date">
                  <strong>{order.date}</strong>
                  <span>{order.time}</span>
                </div>

                <div className="order-actions">
                  <button
                    className="view-order-btn"
                    title="View Order"
                    onClick={() => setSelectedOrder(order)}
                  >
                    👁
                  </button>

                  <div className="more-actions-wrapper">
                    <button
                      className="more-order-btn"
                      title="More Actions"
                      onClick={() =>
                        setOpenMenu(openMenu === order.id ? null : order.id)
                      }
                    >
                      ⋮
                    </button>

                    {openMenu === order.id && (
                      <div className="order-action-menu">
                        <button onClick={handleEdit}>
                          ✏️ Edit Order
                        </button>

                        <button onClick={() => handleUpdateStatus(order)}>
                          🔄 Update Status
                        </button>

                        <button
                          className="delete-action"
                          onClick={() => handleDelete(order)}
                        >
                          🗑️ Delete Order
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-orders">No orders found.</div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <div
          className="order-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="order-view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="order-modal-header">
              <div>
                <h3>Order Details</h3>
                <p>{selectedOrder.orderId}</p>
              </div>

              <button
                className="order-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>

            <div className="order-detail-content">
              <div className="order-detail-row">
                <span>Customer</span>
                <strong>{selectedOrder.customer}</strong>
              </div>

              <div className="order-detail-row">
                <span>Email</span>
                <strong>{selectedOrder.email}</strong>
              </div>

              <div className="order-detail-row">
                <span>Phone</span>
                <strong>{selectedOrder.phone || "Not available"}</strong>
              </div>

              <div className="order-detail-row">
                <span>Products</span>
                <strong>{selectedOrder.products} items</strong>
              </div>

              {selectedOrder.items.map((item, index) => (
                <div className="order-detail-row" key={index}>
                  <span>{item.name || "Product"}</span>
                  <strong>
                    {item.quantity || 1} × ${Number(item.price || 0).toFixed(2)}
                  </strong>
                </div>
              ))}

              <div className="order-detail-row">
                <span>Total Amount</span>
                <strong>${selectedOrder.total.toFixed(2)}</strong>
              </div>

              <div className="order-detail-row">
                <span>Payment Method</span>
                <strong>{selectedOrder.payment}</strong>
              </div>

              <div className="order-detail-row">
                <span>Status</span>
                <span className={`order-status ${getStatusClass(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="order-detail-row">
                <span>Address</span>
                <strong>{selectedOrder.address || "Not available"}</strong>
              </div>

              <div className="order-detail-row">
                <span>Order Date</span>
                <strong>
                  {selectedOrder.date} - {selectedOrder.time}
                </strong>
              </div>
            </div>

            <div className="order-modal-footer">
              <button onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderTable;
