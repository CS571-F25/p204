import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import RoomPage from "./pages/RoomPage.jsx";
import GuidePage from "./pages/GuidePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <div className="d-flex flex-column min-vh-100 bg-dark text-light">
            <header className="border-bottom border-secondary">
              <nav className="container py-3 d-flex flex-column flex-md-row align-items-md-center gap-3 justify-content-between">
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
                  <h1 className="fs-4 mb-0">TermRooms</h1>
                  <div className="d-flex gap-3">
                    <NavLink className="nav-link text-light" to="/">
                      Home
                    </NavLink>
                    <NavLink className="nav-link text-light" to="/room/sample">
                      Room
                    </NavLink>
                    <NavLink className="nav-link text-light" to="/guides">
                      Guides
                    </NavLink>
                    <NavLink className="nav-link text-light" to="/auth">
                      Account
                    </NavLink>
                  </div>
                </div>
                <IdentityBadge />
              </nav>
            </header>

            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/room/:roomId" element={<RoomPage />} />
                <Route path="/guides" element={<GuidePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>

            <footer className="border-top border-secondary py-3 text-center text-muted">
              <small>TermRooms &mdash; CS571 Project Placeholder</small>
            </footer>
          </div>
        </HashRouter>
      </AppProvider>
    </AuthProvider>
  );
}

function IdentityBadge() {
  const { identity, isAuthenticated, logout } = useAuth();
  return (
    <div className="d-flex align-items-center gap-3">
      <span className="badge bg-secondary-subtle text-light text-uppercase">
        {identity.displayName}
      </span>
      {isAuthenticated && (
        <button className="btn btn-outline-light btn-sm" onClick={logout}>
          Logout
        </button>
      )}
    </div>
  );
}

export default App;
