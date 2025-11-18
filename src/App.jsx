import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import RoomPage from "./pages/RoomPage.jsx";
import GuidePage from "./pages/GuidePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import RoomsPage from "./pages/RoomsPage.jsx";
import MailPage from "./pages/MailPage.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <div className="app-shell d-flex flex-column min-vh-100 text-light">
            <header className="app-header py-3">
              <div className="container-fluid px-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-4">
                  <h1 className="fs-4 mb-0 brand-gradient">TermRooms</h1>
                  <div className="d-flex gap-3 nav-links">
                    <NavLink className="nav-link text-light" to="/">
                      Home
                    </NavLink>
                    <NavLink className="nav-link text-light" to="/rooms">
                      Rooms
                    </NavLink>
                    <NavLink className="nav-link text-light" to="/mail">
                      Mail
                    </NavLink>
                    <NavLink className="nav-link text-light" to="/guides">
                      Guides
                    </NavLink>
                    <NavLink className="nav-link text-light" to="/auth">
                      Account
                    </NavLink>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <IdentityBadge />
                </div>
              </div>
            </header>

            <main className="flex-grow-1 py-5">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/room/:roomId" element={<RoomPage />} />
                <Route path="/guides" element={<GuidePage />} />
                <Route path="/rooms" element={<RoomsPage />} />
                <Route path="/mail" element={<MailPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>

            <footer className="app-footer py-4 text-center text-muted">
              <small>TermRooms — Built for CS571</small>
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
    <div className="identity-badge d-flex align-items-center gap-3">
      <span className="badge identity-pill text-uppercase">{identity.displayName}</span>
      {isAuthenticated && (
        <button className="btn btn-outline-light btn-sm" onClick={logout}>
          Logout
        </button>
      )}
    </div>
  );
}

export default App;
