import { useNavigate } from "react-router-dom";
import CommandInput from "./CommandInput.jsx";
import TerminalOutput from "./TerminalOutput.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getRoom,
  deleteRoom,
  getRecents,
  getMessages,
  saveMessages,
  touchRoom,
  saveRoom,
  saveRecents,
  removeParticipant,
  sendInvite,
} from "../utils/storage.js";

const HELP_TEXT = [
  "Available commands:",
  " /help                Show this message",
  " /guide               Open the guide page",
  " /whoami              Show current identity",
  " /setname NAME        Change your display name",
  " /leave               Leave the current room",
  " /delete ID           Delete a room you own",
  " /topic [text]        View or set the current room topic",
  " /invite USER [MSG]   Send an invite to another user",
  " /kick NAME           Remove a participant (lead/co-lead)",
  " /ban NAME            Ban a participant (leader only)",
  " /promote NAME        Make someone a co-leader",
  " /demote NAME         Return a co-leader to member",
  " /recent [clear]      List or clear recently opened rooms",
  " /relay ID [PASS] TXT Send a message into another room",
  " /clear               Clear terminal output",
  " Plain text           Send chat to the room",
];

function Terminal({ onChat, variant = "standalone", onFeedback }) {
  const navigate = useNavigate();
  const { identity, isAuthenticated, setDisplayName } = useAuth();
  const { pushTerminalMessage, clearTerminal, selectRoom, currentRoomId } = useAppContext();

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
      case "topic":
        handleTopicCommand(args, { currentRoomId, identity, print });
        break;
      case "recent":
        handleRecentCommand(args, print);
        break;
      case "relay":
        handleRelayCommand(args, { identity, print });
        break;
      case "invite":
        handleInviteCommand(args, { currentRoomId, identity, print });
        break;
      case "kick":
        handleKickCommand(args, { currentRoomId, identity, print });
        break;
      case "ban":
        handleBanCommand(args, { currentRoomId, identity, print });
        break;
      case "promote":
        handlePromoteCommand(args, { currentRoomId, identity, print });
        break;
      case "demote":
        handleDemoteCommand(args, { currentRoomId, identity, print });
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

function handleTopicCommand(args, { currentRoomId, identity, print }) {
  if (!currentRoomId) {
    print("Join a room before using /topic.", "danger");
    return;
  }
  const room = getRoom(currentRoomId);
  if (!room) {
    print("Room not found.", "danger");
    return;
  }

  if (!args.length) {
    if (room.topic && room.topic.trim().length) {
      print(`Current topic: ${room.topic}`, "info");
    } else {
      print("No topic set for this room.", "info");
    }
    return;
  }

  if (identity.username !== room.ownerUsername) {
    print("Only the room owner can update the topic.", "danger");
    return;
  }

  if (args.length === 1 && args[0].toLowerCase() === "clear") {
    room.topic = "";
    saveRoom(room);
    print("Room topic cleared.", "success");
    return;
  }

  const nextTopic = args.join(" ");
  room.topic = nextTopic;
  saveRoom(room);
  print(`Room topic updated to "${nextTopic}".`, "success");
}

function handleRecentCommand(args, print) {
  if (args.length && args[0].toLowerCase() === "clear") {
    saveRecents([]);
    print("Recent rooms cleared.", "success");
    return;
  }

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
    print("Usage: /relay room-id [password] message", "warning");
    return;
  }

  const [targetId, ...rest] = args;

  const room = getRoom(targetId);
  if (!room) {
    print("Room not found.", "danger");
    return;
  }
  let textParts = rest;
  if (room.password && identity.username !== room.ownerUsername) {
    if (rest.length < 2) {
      print("Usage: /relay room-id password message", "warning");
      return;
    }
    const suppliedPassword = rest[0];
    if (suppliedPassword !== room.password) {
      print("Relay blocked. Password is incorrect.", "danger");
      return;
    }
    textParts = rest.slice(1);
  }

  const text = textParts.join(" ").trim();
  if (!text) {
    print("Message cannot be empty.", "warning");
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

function handleInviteCommand(args, { currentRoomId, identity, print }) {
  if (!args.length) {
    print("Usage: /invite username [message]", "warning");
    return;
  }
  const room = ensureRoomContext(currentRoomId, print);
  if (!room) return;
  if (!canInvite(identity, room)) {
    print("Only leaders or co-leaders can invite.", "danger");
    return;
  }
  const [recipient, ...rest] = args;
  const message =
    rest.join(" ").trim() || `${identity.displayName} invited you to ${room.name}.`;
  sendInvite({
    roomId: room.id,
    recipient,
    message,
    sender: identity.displayName,
  });
  print(`Invite sent to ${recipient}.`, "success");
}

function handleKickCommand(args, { currentRoomId, identity, print }) {
  if (!args.length) {
    print("Usage: /kick display-name", "warning");
    return;
  }
  const room = ensureRoomContext(currentRoomId, print);
  if (!room) return;
  if (!hasLeadership(identity, room)) {
    print("Only leaders or co-leaders can kick participants.", "danger");
    return;
  }
  const targetName = args.join(" ").trim();
  const target = findParticipant(room, targetName);
  if (!target) {
    print("Participant not found.", "danger");
    return;
  }
  const selfRole = getLeadershipRole(identity, room);
  if (target.role === "Leader") {
    print("You cannot kick the leader.", "danger");
    return;
  }
  if (target.role === "Co-leader" && selfRole !== "Leader") {
    print("Only the leader can kick a co-leader.", "danger");
    return;
  }
  removeParticipant(room.id, {
    username: target.username,
    displayName: target.displayName,
  });
  touchRoom(room.id);
  print(`${target.displayName} was removed from the room.`, "success");
}

function handleBanCommand(args, { currentRoomId, identity, print }) {
  if (!args.length) {
    print("Usage: /ban display-name", "warning");
    return;
  }
  const room = ensureRoomContext(currentRoomId, print);
  if (!room) return;
  if (getLeadershipRole(identity, room) !== "Leader") {
    print("Only the leader can ban participants.", "danger");
    return;
  }
  const targetName = args.join(" ").trim();
  room.banned = room.banned ?? [];
  const normalized = targetName.toLowerCase();
  if (!room.banned.some((name) => name.toLowerCase() === normalized)) {
    room.banned.push(targetName);
  }
  removeParticipant(room.id, { username: null, displayName: targetName });
  saveRoom(room);
  touchRoom(room.id);
  print(`${targetName} has been banned from this room.`, "success");
}

function handlePromoteCommand(args, { currentRoomId, identity, print }) {
  if (!args.length) {
    print("Usage: /promote display-name", "warning");
    return;
  }
  const room = ensureRoomContext(currentRoomId, print);
  if (!room) return;
  if (getLeadershipRole(identity, room) !== "Leader") {
    print("Only the leader can promote participants.", "danger");
    return;
  }
  const targetName = args.join(" ").trim();
  const target = findParticipant(room, targetName);
  if (!target) {
    print("Participant not found.", "danger");
    return;
  }
  if (target.role === "Leader") {
    print("The leader cannot be promoted.", "danger");
    return;
  }
  target.role = "coLeader";
  saveRoom(room);
  touchRoom(room.id);
  print(`${target.displayName} is now a co-leader.`, "success");
}

function handleDemoteCommand(args, { currentRoomId, identity, print }) {
  if (!args.length) {
    print("Usage: /demote display-name", "warning");
    return;
  }
  const room = ensureRoomContext(currentRoomId, print);
  if (!room) return;
  if (getLeadershipRole(identity, room) !== "Leader") {
    print("Only the leader can demote participants.", "danger");
    return;
  }
  const targetName = args.join(" ").trim();
  const target = findParticipant(room, targetName);
  if (!target) {
    print("Participant not found.", "danger");
    return;
  }
  if (target.role === "Leader") {
    print("The leader cannot be demoted.", "danger");
    return;
  }
  target.role = "member";
  saveRoom(room);
  touchRoom(room.id);
  print(`${target.displayName} is now a member.`, "success");
}

function ensureRoomContext(currentRoomId, print) {
  if (!currentRoomId) {
    print("Join a room before using this command.", "danger");
    return null;
  }
  const room = getRoom(currentRoomId);
  if (!room) {
    print("Room not found.", "danger");
    return null;
  }
  return room;
}

function getLeadershipRole(identity, room) {
  if (identity.username && identity.username === room.ownerUsername) {
    return "Leader";
  }
  const match = room.participants?.find((p) => {
    if (identity.username && p.username) {
      return p.username === identity.username;
    }
    return (p.displayName ?? "").toLowerCase() === identity.displayName.toLowerCase();
  });
  if (!match) return "Member";
  if (match.role === "coLeader") return "Co-leader";
  if (match.role === "leader") return "Leader";
  return "Member";
}

function hasLeadership(identity, room) {
  const role = getLeadershipRole(identity, room);
  return role === "Leader" || role === "Co-leader";
}

function canInvite(identity, room) {
  return hasLeadership(identity, room);
}

function findParticipant(room, displayName) {
  return room.participants?.find(
    (p) => (p.displayName ?? "").toLowerCase() === displayName.toLowerCase(),
  );
}


