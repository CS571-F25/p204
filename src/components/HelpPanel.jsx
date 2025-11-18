const QUICK_COMMANDS = [
  { cmd: "/create name [password]", desc: "Create a room (must be signed in)." },
  { cmd: "/join room-id [password]", desc: "Join a room directly from the terminal." },
  { cmd: "/msg hello world", desc: "Send a chat message to the current room." },
  { cmd: "/whoami", desc: "See your current identity." },
  { cmd: "/setname New Name", desc: "Update your display name on the fly." },
  { cmd: "/clear", desc: "Clear terminal output." },
];

const SECTIONS = [
  {
    title: "Keyboard Favorites",
    items: QUICK_COMMANDS.slice(0, 3),
  },
  {
    title: "Identity & Cleanup",
    items: QUICK_COMMANDS.slice(3),
  },
];

function HelpPanel() {
  return (
    <div className="glass-panel p-4 text-light mt-4">
      <h2 className="h4 mb-3">Need a refresher?</h2>
      <div className="accordion" id="helpAccordion">
        {SECTIONS.map((section, index) => (
          <div className="accordion-item bg-transparent border-secondary" key={section.title}>
            <h2 className="accordion-header" id={`heading-${index}`}>
              <button
                className="accordion-button bg-transparent text-light"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${index}`}
                aria-expanded={index === 0}
                aria-controls={`collapse-${index}`}
              >
                {section.title}
              </button>
            </h2>
            <div
              id={`collapse-${index}`}
              className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
              aria-labelledby={`heading-${index}`}
              data-bs-parent="#helpAccordion"
            >
              <div className="accordion-body">
                <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                  {section.items.map((item) => (
                    <li key={item.cmd} className="border rounded-3 p-3 bg-black bg-opacity-50">
                      <code>{item.cmd}</code>
                      <p className="mb-0 text-muted small">{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HelpPanel;

