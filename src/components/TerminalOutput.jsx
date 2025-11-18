import { useAppContext } from "../context/AppContext.jsx";

function TerminalOutput() {
  const { terminalOutput } = useAppContext();

  if (!terminalOutput.length) {
    return (
      <div className="terminal-output text-muted">
        <p>Type /help to see available commands.</p>
      </div>
    );
  }

  return (
    <div className="terminal-output">
      {terminalOutput.map((entry) => (
        <div key={entry.id} className={`terminal-line text-${entry.variant ?? "light"}`}>
          {entry.text}
        </div>
      ))}
    </div>
  );
}

export default TerminalOutput;

