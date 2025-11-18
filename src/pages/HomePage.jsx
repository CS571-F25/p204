import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="content-section py-5">
      <div className="section-content text-light home-hero">
        <div>
          <p className="eyebrow text-muted mb-2">Terminal-first collaboration</p>
          <h1 className="display-5 fw-semibold text-light mb-3">TermRooms</h1>
          <p className="lead text-light">
            Spin up a room, share the ID, and work together in a focused terminal surface. Simple,
            local, and fast—no backend required.
          </p>
          <div className="d-flex flex-wrap gap-3 mt-4">
            <Link to="/rooms" className="btn btn-primary-glow btn-lg">
              Manage rooms
            </Link>
            <Link to="/guides" className="btn btn-outline-light btn-lg">
              Read the guide
            </Link>
          </div>
        </div>

        <div className="command-cheatsheet mt-5">
          <h2 className="h5 text-light mb-3">Keyboard commands</h2>
          <ul className="list-unstyled command-list">
            <li>
              <code>/msg</code> send chat to the active room
            </li>
            <li>
              <code>/whoami</code> show your identity
            </li>
            <li>
              <code>/setname</code> update your display name
            </li>
            <li>
              <code>/rooms</code> list rooms you created
            </li>
            <li>
              <code>/leave</code> return to the lobby
            </li>
            <li>
              <code>/clear</code> reset the terminal output
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default HomePage;

