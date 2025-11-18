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
              <div className="glass-panel p-5 text-light auth-state-card d-flex flex-column justify-content-center gap-3">
                <div className="emoji" role="img" aria-label="Party popper">
                  🎉
                </div>
                <h2 className="h4 mb-0">You’re signed in as {identity.displayName}</h2>
                <p className="text-muted mb-0">
                  Head back to Home to create rooms or hop into an existing session. Want to switch
                  accounts? Just log out below.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <Link to="/" className="btn btn-primary-glow">
                    Go to Home
                  </Link>
                  <button className="btn btn-outline-light" onClick={logout}>
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

