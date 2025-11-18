import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AuthForm from "../components/AuthForm.jsx";

function AuthPage() {
  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
          {!isAuthenticated && (
            <div className="col-12 col-lg-6">
              <AuthForm onLogin={login} onSignup={signup} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AuthPage;

