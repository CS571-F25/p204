import { useNavigate } from "react-router-dom";
import CommandInput from "./CommandInput.jsx";
import TerminalOutput from "./TerminalOutput.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getRoom, getRooms, deleteRoom } from "../utils/storage.js";

const HELP_TEXT = [
  "Available commands:",
  " /help                Show this message",
  " /guide               Open the guide page",
  " /whoami              Show current identity",
  " /setname NAME        Change your display name",
  " /leave               Leave the current room",
  " /delete ID           Delete a room you own",
  " /rooms               List rooms you created",
  " /msg TEXT            Send chat to the room",
  " /clear               Clear terminal output",
];

function Terminal({ onChat, variant = "standalone", onFeedback }) {
  const navigate = useNavigate();
  const { identity, isAuthenticated, setDisplayName } = useAuth();
  const { pushTerminalMessage, clearTerminal, selectRoom } = useAppContext();

  const print = (text, variant = "light") => pushTerminalMessage({ text, variant });

  const handleCommand = (rawInput) => {
    const input = rawInput.trim();
    if (!input) return;

    if (!input.startsWith("/")) {
        if (onChat) {
          onChat(input);
          onFeedback?.("Message sent");
        } else {
          print(`Chat coming soon! For now, try /help.`, "warning");
        }
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
      case "msg":
            if (!onChat) {
              print("Messaging is not available yet.", "warning");
            } else if (!args.length) {
          print("Usage: /msg your message text", "warning");
        } else {
          onChat(args.join(" "));
              onFeedback?.("Message sent");
        }
        break;
      case "leave":
        navigate("/");
        selectRoom(null);
        print("Left the room.", "success");
        break;
      case "delete":
        handleDeleteCommand(args, { print, navigate, identity });
        break;
      case "clear":
        clearTerminal();
        break;
      default:
        print(`Unknown command: /${command}. Try /help.`, "danger");
    }
  };

  return (
    <div className={`terminal ${variant === "embedded" ? "terminal-embedded" : ""}`}>
      <TerminalOutput />
      <CommandInput onSubmit={handleCommand} />
    </div>
  );
}

export default Terminal;

function handleDeleteCommand(args, { print, navigate, identity }) {
  if (!args.length) {
    print("Usage: /delete room-id", "warning");
    return;
  }
  const roomId = args[0].toLowerCase();
  const room = getRoom(roomId);
  if (!room) {
    print("Room not found.", "danger");
    return;
  }
  if (identity.username !== room.ownerUsername) {
    print("Only the room owner can delete it.", "danger");
    return;
  }
  deleteRoom(roomId);
  print(`Room ${roomId} deleted.`, "success");
  navigate("/");
}

function handleRoomsCommand(print) {}


