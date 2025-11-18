import { useState } from "react";

const MODES = Object.freeze({
  LOGIN: "login",
  SIGNUP: "signup",
});

function AuthForm({ onLogin, onSignup }) {
  const [mode, setMode] = useState(MODES.LOGIN);
  const [formState, setFormState] = useState({
    username: "",
    pin: "",
    displayName: "",
  });
  const [status, setStatus] = useState({
    type: "info",
    message: "Enter your details below.",
  });

  const isSignup = mode === MODES.SIGNUP;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      if (!formState.username || !formState.pin) {
        throw new Error("Username and PIN are required.");
      }
      if (!/^\d{6}$/.test(formState.pin)) {
        throw new Error("PIN must be exactly 6 digits.");
      }

      if (isSignup) {
        if (!formState.displayName.trim()) {
          throw new Error("Display name is required for sign up.");
        }
        onSignup({
          username: formState.username.trim(),
          pin: formState.pin,
          displayName: formState.displayName.trim(),
        });
        setStatus({ type: "success", message: "Account created. You are now signed in." });
      } else {
        onLogin({
          username: formState.username.trim(),
          pin: formState.pin,
        });
        setStatus({ type: "success", message: "Welcome back!" });
      }
    } catch (error) {
      setStatus({ type: "danger", message: error.message });
    }
  };

  return (
    <div className="form-card">
      <div className="btn-group mb-4" role="group" aria-label="Authentication mode">
        <button
          type="button"
          className={`btn ${isSignup ? "btn-outline-light" : "btn-light"}`}
          onClick={() => setMode(MODES.LOGIN)}
        >
          Log In
        </button>
        <button
          type="button"
          className={`btn ${isSignup ? "btn-light" : "btn-outline-light"}`}
          onClick={() => setMode(MODES.SIGNUP)}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            id="username"
            name="username"
            className="form-control"
            value={formState.username}
            onChange={handleInputChange}
            autoComplete="username"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="pin" className="form-label">
            PIN (6 digits)
          </label>
          <input
            id="pin"
            name="pin"
            type="password"
            pattern="\d{6}"
            maxLength={6}
            className="form-control"
            value={formState.pin}
            onChange={handleInputChange}
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
          />
        </div>
        {isSignup && (
          <div className="mb-3">
            <label htmlFor="displayName" className="form-label">
              Display name
            </label>
            <input
              id="displayName"
              name="displayName"
              className="form-control"
              value={formState.displayName}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        <div className={`alert alert-${status.type}`} role="alert">
          {status.message}
        </div>

        <button type="submit" className="btn btn-primary-glow w-100">
          {isSignup ? "Create Account" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;

