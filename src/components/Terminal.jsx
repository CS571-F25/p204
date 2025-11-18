import { useNavigate } from "react-router-dom";
import CommandInput from "./CommandInput.jsx";
import TerminalOutput from "./TerminalOutput.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getRoom, deleteRoom, getRecents, getMessages, saveMessages, touchRoom } from "../utils/storage.js";

const HELP_TEXT = [
  "Available commands:",
  " /help                Show this message",
  " /guide               Open the guide page",
  " /whoami              Show current identity",
  " /setname NAME        Change your display name",
  " /leave               Leave the current room",
  " /delete ID           Delete a room you own",
  " /recent              List recently opened rooms",
  " /relay ID TEXT       Send a message into another room",
  " /clear               Clear terminal output",
  " Plain text           Send chat to the room",
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
      case "leave":
        navigate("/");
        selectRoom(null);
        print("Left the room.", "success");
        break;
      case "delete":
        handleDeleteCommand(args, { print, navigate, identity });
        break;
      case "recent":
        handleRecentCommand(print);
        break;
      case "relay":
        handleRelayCommand(args, { identity, print });
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

function handleRecentCommand(print) {
  const recents = getRecents();
  if (!recents.length) {
    print("No recent rooms yet. Join a room to get started.", "info");
    return;
  }

  print("Recently opened rooms:", "info");
  recents.forEach((id, index) => {
    const room = getRoom(id);
    if (room) {
      print(` ${index + 1}. ${room.name} (${room.id})`, "light");
    } else {
      print(` ${index + 1}. ${id} (deleted)`, "warning");
    }
  });
}

function handleRelayCommand(args, { identity, print }) {
  if (args.length < 2) {
    print("Usage: /relay room-id message", "warning");
    return;
  }

  const [targetId, ...bodyParts] = args;
  const text = bodyParts.join(" ").trim();
  if (!text) {
    print("Message cannot be empty.", "warning");
    return;
  }

  const room = getRoom(targetId);
  if (!room) {
    print("Room not found.", "danger");
    return;
  }

  const history = getMessages(room.id);
  const relayMessage = {
    id: crypto.randomUUID(),
    user: `${identity.displayName} (relay)`,
    text,
    type: "message",
    timestamp: new Date().toISOString(),
  };

  saveMessages(room.id, [...history, relayMessage]);
  touchRoom(room.id);
  print(`Message relayed to ${room.name}.`, "success");
}


