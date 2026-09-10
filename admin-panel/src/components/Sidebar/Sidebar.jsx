import React from "react";
import "./Sidebar.css";

function Sidebar() {
  const currentPath = window.location.pathname;

  return (
    <aside className="sidebar">

      <h2>AdminPanel</h2>

      <nav>

        <a
          href="/"
          className={currentPath === "/" ? "active" : ""}
        >
          Dashboard
        </a>

        <a
          href="/products"
          className={currentPath === "/products" ? "active" : ""}
        >
          Products
        </a>

        <a
          href="/orders"
          className={currentPath === "/orders" ? "active" : ""}
        >
          Orders
        </a>

        <a
          href="/customers"
          className={currentPath === "/customers" ? "active" : ""}
        >
          Customers
        </a>

      </nav>

    </aside>
  );
}

export default Sidebar;