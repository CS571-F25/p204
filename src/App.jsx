import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import RoomPage from "./pages/RoomPage.jsx";
import GuidePage from "./pages/GuidePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <div className="d-flex flex-column min-vh-100 bg-dark text-light">
        <header className="border-bottom border-secondary">
          <nav className="container py-3 d-flex flex-column flex-md-row align-items-md-center gap-3">
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
                Sign In
              </NavLink>
            </div>
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
  );
}

export default App;
