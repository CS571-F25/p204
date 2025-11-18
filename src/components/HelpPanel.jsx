const QUICK_COMMANDS = [
  { cmd: "/create name [password]", desc: "Create a room (must be signed in)." },
  { cmd: "/join room-id [password]", desc: "Join a room directly from the terminal." },
  { cmd: "/msg hello world", desc: "Send a chat message to the current room." },
  { cmd: "/whoami", desc: "See your current identity." },
  { cmd: "/setname New Name", desc: "Update your display name on the fly." },
  { cmd: "/clear", desc: "Clear terminal output." },
];

function HelpPanel() {
  return (
    <div className="glass-panel p-4 text-light mt-4">
      <h2 className="h4 mb-3">Need a refresher?</h2>
      <p className="text-muted">
        You can always open the full guide, but here are a few commands to get you going quickly:
      </p>
      <ul className="list-unstyled d-flex flex-column gap-2">
        {QUICK_COMMANDS.map((item) => (
          <li key={item.cmd} className="border rounded-3 p-3 bg-black bg-opacity-50">
            <code>{item.cmd}</code>
            <p className="mb-0 text-muted small">{item.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HelpPanel;

