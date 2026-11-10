import "./Navbar.css";

function Navbar({ isMenuOpen, onMenuToggle }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="menu-toggle"
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          onClick={onMenuToggle}
        >
          <span />
          <span />
          <span />
        </button>
        <h1>Dashboard</h1>
      </div>

      <div className="navbar-right">
        <div className="search-box">
          <input type="text" placeholder="Search..." />
        </div>

        <div className="notification">
          🔔
        </div>

        <div className="profile">
          <div className="profile-avatar">A</div>
          <div className="profile-info">
            <strong>Admin User</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;