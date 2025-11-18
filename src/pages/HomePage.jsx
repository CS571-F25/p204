import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="home-hero-shell">
      <div className="hero-grid">
        <div className="hero-copy text-light">
          <p className="eyebrow text-uppercase text-white-50">Terminal-first collaboration</p>
          <h1>TermRooms</h1>
          <p className="lead">
            Launch a collaborative console, invite teammates, and ship quicker. Fully client-side
            today; Firebase-ready tomorrow.
          </p>
          <div className="cta-row">
            <Link to="/rooms" className="btn btn-primary-glow btn-lg">
              Manage rooms
            </Link>
            <Link to="/mail" className="btn btn-outline-light btn-lg">
              Open mailbox
            </Link>
          </div>
          <div className="hero-supplement">
            <div>
              <h2>Live Roles</h2>
              <p>Leader, Co-leader, and Member control right from the console.</p>
            </div>
            <div>
              <h2>Fast Invites</h2>
              <p>Send in-app mail or `/invite user` straight from the terminal.</p>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-terminal-preview">
            <div className="prompt">$ /topic team sync</div>
            <p className="text-white">Topic set to “team sync”</p>
            <div className="prompt">$ /invite classmate01 10am retro</div>
            <p className="text-white">Invite sent to classmate01</p>
            <div className="prompt">$ /promote alex</div>
            <p className="text-white">alex is now a co-leader.</p>
          </div>
        </div>
      </div>
      <div className="command-pills">
        <div className="pill">
          <code>/topic [text]</code>
          <span>Set room focus</span>
        </div>
        <div className="pill">
          <code>/invite &lt;user&gt;</code>
          <span>Send mailbox invite</span>
        </div>
        <div className="pill">
          <code>/kick &lt;name&gt;</code>
          <span>Moderate quickly</span>
        </div>
        <div className="pill">
          <code>/recent [clear]</code>
          <span>Jump between rooms</span>
        </div>
      </div>
    </section>
  );
}

export default HomePage;

