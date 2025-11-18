import { useNavigate } from "react-router-dom";
import CommandInput from "./CommandInput.jsx";
import TerminalOutput from "./TerminalOutput.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  createRoomRecord,
  getRoom,
  getRooms,
  recordRecentRoom,
  roomPasswordMatches,
  deleteRoom,
} from "../utils/storage.js";

const HELP_TEXT = [
  "Available commands:",
  " /help                Show this message",
  " /guide               Open the guide page",
  " /whoami              Show current identity",
  " /setname NAME        Change your display name",
  " /create NAME [PASS]  Create a new room (signed-in only)",
  " /join ID [PASS]      Join a room by ID",
  " /leave               Leave the current room",
  " /delete ID           Delete a room you own",
  " /rooms               List rooms you created",
  " /msg TEXT            Send chat to the room",
  " /clear               Clear terminal output",
];

function Terminal({ onChat }) {
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
        print("Message sent.", "success");
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
          print("Message sent.", "success");
        }
        break;
      case "create":
        handleCreateCommand(args, { print, navigate, selectRoom, identity, isAuthenticated });
        break;
      case "join":
        handleJoinCommand(args, { print, navigate, selectRoom });
        break;
      case "leave":
        navigate("/");
        selectRoom(null);
        print("Left the room.", "success");
        break;
      case "delete":
        handleDeleteCommand(args, { print, navigate, identity });
        break;
      case "rooms":
        handleRoomsCommand(print);
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

function handleCreateCommand(args, { print, navigate, selectRoom, identity, isAuthenticated }) {
  if (!args.length) {
    print("Usage: /create room-name [password]", "warning");
    return;
  }
  const name = args[0];
  const password = args[1] ?? "";

  try {
    if (!isAuthenticated || !identity.username) {
      throw new Error("You must be signed in to create rooms.");
    }
    const room = createRoomRecord({
      name,
      password,
      ownerUsername: identity.username,
      ownerDisplayName: identity.displayName,
    });
    print(`Room "${room.name}" created with ID ${room.id}`, "success");
    selectRoom(room.id);
    navigate(`/room/${room.id}`);
  } catch (error) {
    print(error.message, "danger");
  }
}

function handleJoinCommand(args, { print, navigate, selectRoom }) {
  if (!args.length) {
    print("Usage: /join room-id [password]", "warning");
    return;
  }
  const roomId = args[0].toLowerCase();
  const password = args[1] ?? "";
  const room = getRoom(roomId);
  if (!room) {
    print(`Room ${roomId} not found.`, "danger");
    return;
  }
  if (!roomPasswordMatches(room, password)) {
    print("Incorrect password.", "danger");
    return;
  }
  recordRecentRoom(room.id);
  selectRoom(room.id);
  print(`Joining room "${room.name}"...`, "success");
  navigate(`/room/${room.id}`);
}

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

function handleRoomsCommand(print) {
  const rooms = getRooms();
  if (!rooms.length) {
    print("You have not created any rooms yet.", "info");
    return;
  }
  rooms
    .slice()
    .reverse()
    .forEach((room) => {
      print(`${room.id} - ${room.name} (owner: ${room.ownerDisplayName})`, "info");
    });
}


