import { useState } from "react";
import "./Login.css";

const ADMIN_EMAIL = "hasnain@1234";
const ADMIN_PASSWORD = "hasnain1234";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      email.trim().toLowerCase() !== ADMIN_EMAIL ||
      password !== ADMIN_PASSWORD
    ) {
      setError("Email ya password sahi nahi hai.");
      return;
    }

    onLogin();
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand-mark" aria-hidden="true">A</div>
        <p className="login-eyebrow">ADMIN PANEL</p>
        <h1 id="login-title">Welcome back</h1>
        <p className="login-description">
          Sign in with your admin account to continue.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="text"
            autoComplete="username"
            placeholder="Enter your admin email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            required
          />

          <label htmlFor="admin-password">Password</label>
          <div className="password-input-wrap">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              required
            />
            <button
              className="password-visibility-toggle"
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
                  <path d="M9.9 5.2A10.8 10.8 0 0112 5c5.5 0 9 7 9 7a15.7 15.7 0 01-3 3.8M6.2 6.2C3.9 7.7 3 12 3 12s3.5 7 9 7a9.5 9.5 0 004.1-.9" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {error && <p className="login-error" role="alert">{error}</p>}

          <button type="submit">Sign in</button>
        </form>
      </section>
    </main>
  );
}

export default Login;
