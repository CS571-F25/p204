import { COMMAND_SECTIONS } from "../constants/commandCatalog.js";

function HelpPanel() {
  return (
    <div className="quick-commands mt-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <h2 className="h5 mb-0 text-light">Need a refresher?</h2>
        <p className="mb-0 text-muted small">Type any of these shortcuts in the terminal.</p>
      </div>
      {COMMAND_SECTIONS.map((section) => (
        <div key={section.key} className="mb-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
            <h3 className="h6 text-white-75 mb-0">{section.title}</h3>
            <span className="badge bg-secondary text-uppercase">{section.scope}</span>
          </div>
          <div className="row g-2">
            {section.commands.map((command) => (
              <div key={`${section.key}-${command.syntax}`} className="col-12 col-md-6 col-xl-4">
                <div className="command-chip">
                  <code>{command.syntax}</code>
                  <span>{command.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HelpPanel;

