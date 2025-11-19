import { COMMAND_SECTIONS } from "../constants/commandCatalog.js";

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
            <p className="text-white-50 small mb-3">
              Commands use `&lt;required&gt;` arguments and `[optional]` arguments. Sections below
              mirror what the in-app `/help` command prints.
            </p>
            {COMMAND_SECTIONS.map((section) => (
              <div key={section.key} className="mb-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                  <h3 className="h6 text-uppercase text-white-75 mb-0">{section.title}</h3>
                  <span className="badge bg-secondary text-uppercase">{section.scope}</span>
                </div>
                <div className="command-grid">
                  {section.commands.map((command) => (
                    <div key={command.syntax} className="command-row">
                      <code>{command.syntax}</code>
                      <span>{command.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default GuidePage;

