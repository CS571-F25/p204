import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AuthForm from "../components/AuthForm.jsx";

function AuthPage() {
  const { login, signup, isAuthenticated, identity, logout } = useAuth();

  return (
    <section className="content-section py-5">
      <div className="section-content">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-lg-6">
            <div className="glass-panel p-5 text-light h-100">
              <h1 className="mb-3">Account Access</h1>
              <p className="text-muted mb-0">
                Create a new TermRooms account or sign in to an existing one. Everything stays in your
                browser—no servers required. After signing in, you can create rooms, manage sessions,
                and update your identity on the fly.
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            {isAuthenticated ? (
              <div className="glass-panel p-5 text-light d-flex flex-column gap-3">
                <p className="eyebrow text-muted mb-1">Signed in as</p>
                <h2 className="h4 mb-0">{identity.displayName}</h2>
                <div className="d-flex flex-column gap-1 text-muted small">
                  <span>Username: {identity.username}</span>
                  <span>Role: {identity.role}</span>
                </div>
                <div className="d-flex flex-wrap gap-3">
                  <Link to="/" className="btn btn-primary-glow flex-grow-1">
                    Return Home
                  </Link>
                  <button className="btn btn-outline-light flex-grow-1" onClick={logout}>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <AuthForm onLogin={login} onSignup={signup} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthPage;

