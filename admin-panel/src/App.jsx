import { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";

import Dashboard from "./pages/Dashboard/Dashboard";
import Products from "./pages/Products/Products";
import Orders from "./pages/Orders/Orders";
import Customers from "./pages/Customers/Customers";


function App() {
  const path = window.location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
      <Sidebar
        isOpen={isSidebarOpen}
        onNavigate={() => setIsSidebarOpen(false)}
      />
      {isSidebarOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="main-content">
        <Navbar
          isMenuOpen={isSidebarOpen}
          onMenuToggle={() => setIsSidebarOpen((open) => !open)}
        />

        <main>
          {page}
        </main>
      </div>
    </div>
  );
}

export default App;