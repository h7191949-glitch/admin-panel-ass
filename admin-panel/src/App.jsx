import { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";

import Dashboard from "./pages/Dashboard/Dashboard";
import Products from "./pages/Products/Products";
import Orders from "./pages/Orders/Orders";
import Customers from "./pages/Customers/Customers";
import Login from "./pages/Login/Login";
import Settings from "./pages/Settings/Settings";

const AUTH_SESSION_KEY = "admin-panel-authenticated";

function App() {
  const path = window.location.pathname;
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(AUTH_SESSION_KEY) === "true"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = () => {
    sessionStorage.setItem(AUTH_SESSION_KEY, "true");
    window.history.replaceState(null, "", "/");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  let page;

  const navigate = (destination) => {
    window.location.href = destination;
  };

  if (path === "/products") {
    page = (
      <Products
        openAddOnMount={
          new URLSearchParams(window.location.search).get("action") === "add"
        }
      />
    );
  } else if (path === "/orders") {
    page = <Orders />;
  } else if (path === "/customers") {
    page = <Customers />;
  } else if (path === "/settings") {
    page = <Settings onLogout={handleLogout} />;
  } else {
    page = <Dashboard onNavigate={navigate} />;
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