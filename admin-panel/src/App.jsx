import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";

import Dashboard from "./pages/Dashboard/Dashboard";
import Products from "./pages/Products/Products";
import Orders from "./pages/Orders/Orders";
import Customers from "./pages/Customers/Customers";


function App() {
  const path = window.location.pathname;

  let page;

  if (path === "/products") {
    page = <Products />;
  } else if (path === "/orders") {
    page = <Orders />;
  } else if (path === "/customers") {
    page = <Customers />;
  } else {
    page = <Dashboard />;
  }

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <main>
          {page}
        </main>
      </div>
    </div>
  );
}

export default App;