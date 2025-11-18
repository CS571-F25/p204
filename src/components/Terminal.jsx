import { useNavigate } from "react-router-dom";
import CommandInput from "./CommandInput.jsx";
import TerminalOutput from "./TerminalOutput.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const HELP_TEXT = [
  "Available commands:",
  " /help                Show this message",
  " /guide               Open the guide page",
  " /whoami              Show current identity",
  " /setname NAME        Change your display name",
  " /clear               Clear terminal output",
];

function Terminal() {
  const navigate = useNavigate();
  const { identity, setDisplayName } = useAuth();
  const { pushTerminalMessage, clearTerminal } = useAppContext();

  const print = (text, variant = "light") => pushTerminalMessage({ text, variant });

  const handleCommand = (rawInput) => {
    const input = rawInput.trim();
    if (!input) return;

    if (!input.startsWith("/")) {
      print(`Chat coming soon! For now, try /help.`, "warning");
      return;
    }

    const parts = input.slice(1).split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case "help":
        HELP_TEXT.forEach((line) => print(line, "info"));
        break;
      case "guide":
        navigate("/guides");
        print("Opening guide...", "info");
        break;
      case "whoami":
        print(`You are ${identity.displayName} (${identity.role}).`, "info");
        break;
      case "setname":
        if (!args.length) {
          print("Usage: /setname Display Name", "warning");
        } else {
          const newName = args.join(" ");
          setDisplayName(newName);
          print(`Display name updated to ${newName}`, "success");
        }
        break;
      case "clear":
        clearTerminal();
        break;
      default:
        print(`Unknown command: /${command}. Try /help.`, "danger");
    }
  };

  return (
    <div className="terminal border border-secondary rounded-3 p-3 bg-black text-light">
      <TerminalOutput />
      <CommandInput onSubmit={handleCommand} />
    </div>
  );
}

export default Terminal;

