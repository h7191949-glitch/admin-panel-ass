import "./Sidebar.css";

function Sidebar({ isOpen, onNavigate }) {
  const currentPath = window.location.pathname;

  return (
    <aside className={`sidebar${isOpen ? " is-open" : ""}`}>

      <h2>AdminPanel</h2>

      <nav>

        <a
          href="/"
          className={currentPath === "/" ? "active" : ""}
          onClick={onNavigate}
        >
          Dashboard
        </a>

        <a
          href="/products"
          className={currentPath === "/products" ? "active" : ""}
          onClick={onNavigate}
        >
          Products
        </a>

        <a
          href="/orders"
          className={currentPath === "/orders" ? "active" : ""}
          onClick={onNavigate}
        >
          Orders
        </a>

        <a
          href="/customers"
          className={currentPath === "/customers" ? "active" : ""}
          onClick={onNavigate}
        >
          Customers
        </a>

      </nav>

    </aside>
  );
}

export default Sidebar;