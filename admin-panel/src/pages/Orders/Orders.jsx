
import React, { useEffect, useMemo, useState } from "react";
import "./Orders.css";

import OrderStats from "../../components/OrderStats/OrderStats";
import OrderFilters from "../../components/OrderFilters/OrderFilters";
import OrderTable from "../../components/OrderTable/OrderTable";

const API_URL = "http://localhost:5000/api/orders";

function formatOrder(order) {
  const date = new Date(order.createdAt);

  return {
    id: order._id,
    orderId: `#${order._id.slice(-6).toUpperCase()}`,
    customer: order.customerName,
    email: order.email,
    productIcon: "🛍️",
    products: order.products?.reduce(
      (total, item) => total + (item.quantity || 1), 0
    ) || 0,
    total: order.totalAmount || 0,
    payment: "Not specified",
    status: order.status,
    date: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    address: order.address || "",
    phone: order.phone || "",
    items: order.products || [],
  };
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.map(formatOrder));
    } catch (error) {
      console.error("Orders Error:", error);
      alert("Orders load nahi ho sake. Backend check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        order.orderId.toLowerCase().includes(searchText) ||
        order.customer.toLowerCase().includes(searchText) ||
        order.email.toLowerCase().includes(searchText);

      const matchesStatus =
        status === "All Statuses" || order.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  const handleDelete = async (order) => {
    try {
      const response = await fetch(`${API_URL}/${order.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setOrders((previous) =>
        previous.filter((item) => item.id !== order.id)
      );

      alert("Order deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Order delete nahi hua.");
    }
  };

  const handleUpdateStatus = async (order, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      setOrders((previous) =>
        previous.map((item) =>
          item.id === order.id
            ? { ...item, status: newStatus }
            : item
        )
      );

      alert("Order status updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Status update nahi hua.");
    }
  };

  const exportOrders = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Email",
      "Products",
      "Total Amount",
      "Status",
      "Order Date",
      "Order Time",
    ];

    const rows = orders.map((order) => [
      order.orderId,
      order.customer,
      order.email,
      order.products,
      order.total,
      order.status,
      order.date,
      order.time,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((value) =>
          `"${String(value).replaceAll('"', '""')}"`
        ).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "orders.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="orders-page">
      <div className="orders-heading">
        <div>
          <h2>Orders</h2>
          <p>Manage your store orders and track customer purchases.</p>
        </div>

        <button className="export-orders-btn" onClick={exportOrders}>
          ↓ Export Orders
        </button>
      </div>

      <OrderStats orders={orders} />

      <div className="orders-section">
        <div className="orders-section-header">
          <div>
            <h3>All Orders</h3>
            <p>Browse and manage all customer orders.</p>
          </div>

          <OrderFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
          />
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <OrderTable
            orders={filteredOrders}
            onDelete={handleDelete}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        <div className="orders-footer">
          <span>
            Showing {filteredOrders.length} of {orders.length} orders
          </span>
        </div>
      </div>
    </div>
  );
}

export default Orders;
