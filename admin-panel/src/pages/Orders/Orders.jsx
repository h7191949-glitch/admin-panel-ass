import React, { useMemo, useState } from "react";
import "./Orders.css";

import OrderStats from "../../components/OrderStats/OrderStats";
import OrderFilters from "../../components/OrderFilters/OrderFilters";
import OrderTable from "../../components/OrderTable/OrderTable";

function Orders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");

  const [orders] = useState([
    {
      id: 1,
      orderId: "#1001",
      customer: "Sarah Khan",
      email: "sarah@example.com",
      productIcon: "🎧",
      products: 2,
      total: 398,
      payment: "Credit Card",
      status: "Delivered",
      date: "May 1, 2025",
      time: "10:30 AM",
    },

    {
      id: 2,
      orderId: "#1002",
      customer: "Ali Raza",
      email: "ali@example.com",
      productIcon: "⌚",
      products: 1,
      total: 249,
      payment: "PayPal",
      status: "Processing",
      date: "Apr 30, 2025",
      time: "02:15 PM",
    },

    {
      id: 3,
      orderId: "#1003",
      customer: "Ayesha Malik",
      email: "ayesha@example.com",
      productIcon: "👟",
      products: 3,
      total: 387,
      payment: "Credit Card",
      status: "Shipped",
      date: "Apr 29, 2025",
      time: "11:45 AM",
    },

    {
      id: 4,
      orderId: "#1004",
      customer: "Usman Tariq",
      email: "usman@example.com",
      productIcon: "🎒",
      products: 2,
      total: 178,
      payment: "Cash on Delivery",
      status: "Delivered",
      date: "Apr 28, 2025",
      time: "09:20 AM",
    },

    {
      id: 5,
      orderId: "#1005",
      customer: "Fatima Noor",
      email: "fatima@example.com",
      productIcon: "💻",
      products: 1,
      total: 899,
      payment: "Credit Card",
      status: "Pending",
      date: "Apr 27, 2025",
      time: "04:10 PM",
    },

    {
      id: 6,
      orderId: "#1006",
      customer: "Hamza Ahmed",
      email: "hamza@example.com",
      productIcon: "🎧",
      products: 2,
      total: 398,
      payment: "PayPal",
      status: "Cancelled",
      date: "Apr 26, 2025",
      time: "01:30 PM",
    },

    {
      id: 7,
      orderId: "#1007",
      customer: "Zainab Ali",
      email: "zainab@example.com",
      productIcon: "⌚",
      products: 1,
      total: 249,
      payment: "Credit Card",
      status: "Delivered",
      date: "Apr 25, 2025",
      time: "12:05 PM",
    },

    {
      id: 8,
      orderId: "#1008",
      customer: "Bilal Khan",
      email: "bilal@example.com",
      productIcon: "👟",
      products: 2,
      total: 258,
      payment: "Cash on Delivery",
      status: "Pending",
      date: "Apr 24, 2025",
      time: "03:40 PM",
    },
  ]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        order.orderId.toLowerCase().includes(searchText) ||
        order.customer.toLowerCase().includes(searchText) ||
        order.email.toLowerCase().includes(searchText);

      const matchesStatus =
        status === "All Statuses" ||
        order.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);
  const exportOrders = () => {
  const headers = [
    "Order ID",
    "Customer",
    "Email",
    "Products",
    "Total Amount",
    "Payment Method",
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
    order.payment,
    order.status,
    order.date,
    order.time,
  ]);

  const csvContent = [
    headers,
    ...rows,
  ]
    .map((row) =>
      row
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "orders.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

  return (
    <div className="orders-page">

      {/* Page Heading */}

      <div className="orders-heading">

        <div>
          <h2>Orders</h2>

          <p>
            Manage your store orders and track customer purchases.
          </p>
        </div>

       <button
  className="export-orders-btn"
  onClick={exportOrders}
>
  ↓ Export Orders
</button>
      </div>


      {/* Statistics */}

      <OrderStats orders={orders} />


      {/* Orders Section */}

      <div className="orders-section">

        <div className="orders-section-header">

          <div>
            <h3>All Orders</h3>

            <p>
              Browse and manage all customer orders.
            </p>
          </div>

          <OrderFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
          />

        </div>


        {/* Table */}

        <OrderTable orders={filteredOrders} />


        {/* Bottom */}

        <div className="orders-footer">

          <span>
            Showing {filteredOrders.length} of {orders.length} orders
          </span>

          <div className="orders-pagination">

            <button>←</button>

            <button className="active-page">1</button>

            <button>2</button>

            <button>3</button>

            <button>→</button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Orders;