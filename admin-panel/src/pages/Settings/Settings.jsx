import "./Settings.css";

function Settings({ onLogout }) {
  return (
    <div className="settings-page">
      <div className="settings-heading">
        <h2>Admin Panel Settings</h2>
        <p>Manage your admin account and panel access.</p>
      </div>

      <section className="settings-card" aria-labelledby="account-settings-title">
        <div>
          <h3 id="account-settings-title">Admin account</h3>
          <p>Signed in as hasnain@1234</p>
        </div>
        <button className="settings-logout-button" type="button" onClick={onLogout}>
          Log out
        </button>
      </section>
    </div>
  );
}

export default Settings;
