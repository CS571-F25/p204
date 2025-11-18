import { useAppContext } from "../context/AppContext.jsx";

function TerminalOutput() {
  const { terminalOutput } = useAppContext();

  if (!terminalOutput.length) {
    return null;
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

