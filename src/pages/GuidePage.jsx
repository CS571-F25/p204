const COMMANDS = [
  { cmd: "/help", desc: "List available commands." },
  { cmd: "/guide", desc: "Jump to this guide page." },
  { cmd: "/create name [password]", desc: "Create a new room (signed-in users only)." },
  { cmd: "/join room-id [password]", desc: "Join a room by ID." },
  { cmd: "/msg text", desc: "Send a chat message." },
  { cmd: "/leave", desc: "Return to the home page." },
  { cmd: "/delete room-id", desc: "Delete a room you own." },
  { cmd: "/rooms", desc: "List rooms you created." },
  { cmd: "/history [count]", desc: "Load earlier messages (button also available)." },
  { cmd: "/setname name", desc: "Update your display name." },
  { cmd: "/whoami", desc: "Show your current identity." },
  { cmd: "/clear", desc: "Clear terminal output." },
];

function GuidePage() {
  return (
    <section className="py-5">
      <div className="container-fluid px-4 text-light">
        <div className="glass-panel p-5">
          <h1 className="mb-4">Guide &amp; Onboarding</h1>

          <div className="mb-5">
            <h2 className="h4">Getting Started</h2>
            <ol className="text-muted">
              <li>Create an account or log in via the Account page (top-right).</li>
              <li>Create a room from the Home forms or using `/create` inside the terminal.</li>
              <li>Share the room ID with collaborators; they can join via form or `/join`.</li>
              <li>Use `/msg` or simply type to chat. Use `/help` anytime if you forget a command.</li>
            </ol>
          </div>

          <div className="mb-5">
            <h2 className="h4">Command Glossary</h2>
            <div className="row g-3">
              {COMMANDS.map((item) => (
                <div key={item.cmd} className="col-12 col-md-6">
                  <div className="border rounded-4 p-3 bg-black bg-opacity-50 h-100">
                    <code>{item.cmd}</code>
                    <p className="mb-0 text-muted small">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="h4">Accessibility Checklist</h2>
            <ul className="text-muted">
              <li>All interactive elements are keyboard-accessible and have visible focus states.</li>
              <li>Forms include labels and helper text; alerts use `aria-live` regions.</li>
              <li>Contrast ratios meet WCAG AA guidelines for dark themes.</li>
              <li>Semantic headings structure the page content for assistive tech.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GuidePage;

