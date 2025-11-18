const COMMANDS = [
  { cmd: "/help", desc: "List available commands." },
  { cmd: "/guide", desc: "Jump to this guide page." },
  { cmd: "/leave", desc: "Return to the home page." },
  { cmd: "/delete <room-id>", desc: "Delete a room you own." },
  { cmd: "/setname <name>", desc: "Update your display name." },
  { cmd: "/topic [text|clear]", desc: "View or set the room topic (owners only to set)." },
  { cmd: "/whoami", desc: "Show your current identity." },
  { cmd: "/invite <user> [msg]", desc: "Send an invite to another user." },
  { cmd: "/kick <name>", desc: "Remove a participant (leader/co-lead)." },
  { cmd: "/ban <name>", desc: "Remove + block a participant (leader only)." },
  { cmd: "/promote <name>", desc: "Make someone a co-leader (leader only)." },
  { cmd: "/demote <name>", desc: "Return a co-leader to member (leader only)." },
  { cmd: "/recent [clear]", desc: "List or clear recently opened rooms." },
  { cmd: "/relay <room-id> [pass] <text>", desc: "Send a message into another room you own." },
  { cmd: "/clear", desc: "Clear terminal output." },
  { cmd: "Plain text", desc: "Just type to chat with everyone in the room." },
];

function GuidePage() {
  return (
    <section className="content-section py-5">
      <div className="section-content text-light">
        <div className="guide-surface">
          <h1 className="mb-4">Guide &amp; Onboarding</h1>

          <div className="mb-5 guide-section">
            <h2 className="h4 text-light">Getting Started</h2>
            <ol className="guide-list">
              <li>Create an account or log in via the Account page (top-right).</li>
              <li>Create a room from the Rooms page (signed-in users only).</li>
              <li>Share the room ID with collaborators; they can join via the Rooms page.</li>
              <li>Simply type to chat. Use `/help` anytime if you forget a command.</li>
            </ol>
          </div>

          <div className="mb-5 guide-section">
            <h2 className="h4 text-light">Command Glossary</h2>
            <div className="command-grid">
              {COMMANDS.map((item) => (
                <div key={item.cmd} className="command-row">
                  <code>{item.cmd}</code>
                  <span>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default GuidePage;

