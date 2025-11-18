const QUICK_COMMANDS = [
  { cmd: "/help", desc: "Show the list of available commands." },
  { cmd: "/whoami", desc: "See your current identity." },
  { cmd: "/setname New Name", desc: "Update your display name on the fly." },
  { cmd: "/leave", desc: "Return to the home page." },
  { cmd: "/delete room-id", desc: "Delete a room you own." },
  { cmd: "/clear", desc: "Clear terminal output." },
  { cmd: "Plain text", desc: "Just type to chat with everyone in the room." },
];

function HelpPanel() {
  return (
    <div className="quick-commands mt-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <h2 className="h5 mb-0 text-light">Need a refresher?</h2>
        <p className="mb-0 text-muted small">Type any of these shortcuts in the terminal.</p>
      </div>
      <div className="row g-2">
        {QUICK_COMMANDS.map((item) => (
          <div key={item.cmd} className="col-12 col-md-6 col-xl-4">
            <div className="command-chip">
              <code>{item.cmd}</code>
              <span>{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HelpPanel;

