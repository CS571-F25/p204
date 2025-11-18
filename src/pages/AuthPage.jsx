import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const MODES = {
  LOGIN: "login",
  SIGNUP: "signup",
};

function AuthPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState(MODES.LOGIN);
  const [formState, setFormState] = useState({
    username: "",
    pin: "",
    displayName: "",
  });
  const [status, setStatus] = useState({ type: "info", message: "Enter your details below." });

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
      if (!/^\d{4}$/.test(formState.pin)) {
        throw new Error("PIN must be exactly 4 digits.");
      }

      if (isSignup) {
        if (!formState.displayName.trim()) {
          throw new Error("Display name is required for sign up.");
        }
        signup({
          username: formState.username.trim(),
          pin: formState.pin,
          displayName: formState.displayName.trim(),
        });
        setStatus({ type: "success", message: "Account created. You are now signed in." });
      } else {
        login({
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
    <section className="py-5">
      <div className="container" style={{ maxWidth: 480 }}>
        <h1>Account Access</h1>
        <p className="text-muted">
          Create a new TermRooms account or sign in to an existing one. PINs are stored locally and
          never leave your device.
        </p>

        <div className="btn-group mb-4" role="group" aria-label="Authentication mode">
          <button
            type="button"
            className={`btn ${mode === MODES.LOGIN ? "btn-light" : "btn-outline-light"}`}
            onClick={() => setMode(MODES.LOGIN)}
          >
            Log In
          </button>
          <button
            type="button"
            className={`btn ${mode === MODES.SIGNUP ? "btn-light" : "btn-outline-light"}`}
            onClick={() => setMode(MODES.SIGNUP)}
          >
            Sign Up
          </button>
        </div>

        <form className="bg-black border border-secondary rounded-4 p-4" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              className="form-control bg-dark text-light border-secondary"
              value={formState.username}
              onChange={handleInputChange}
              autoComplete="username"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="pin" className="form-label">
              PIN (4 digits)
            </label>
            <input
              id="pin"
              name="pin"
              type="password"
              pattern="\d{4}"
              maxLength={4}
              className="form-control bg-dark text-light border-secondary"
              value={formState.pin}
              onChange={handleInputChange}
              autoComplete={mode === MODES.LOGIN ? "current-password" : "new-password"}
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
                className="form-control bg-dark text-light border-secondary"
                value={formState.displayName}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className={`alert alert-${status.type}`} role="alert">
            {status.message}
          </div>

          <button type="submit" className="btn btn-light w-100">
            {isSignup ? "Create Account" : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AuthPage;

