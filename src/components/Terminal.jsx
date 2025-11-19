import { useNavigate } from "react-router-dom";
import CommandInput from "./CommandInput.jsx";
import TerminalOutput from "./TerminalOutput.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  deleteRoom,
  getMessages,
  getRecents,
  getRoom,
  removeParticipant,
  saveMessages,
  saveRecents,
  saveRoom,
  sendInvite,
  touchRoom,
} from "../utils/storage.js";
import { COMMAND_SECTIONS } from "../constants/commandCatalog.js";

const ROOM_ROLES = {
  LEADER: "leader",
  CO_LEADER: "coLeader",
  MEMBER: "member",
  GUEST: "guest",
};

const HELP_PADDING = 32;

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
        print("Chat coming soon! For now, try /help.", "warning");
      }
      return;
    }

    const parts = input.slice(1).split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case "help":
        printHelp(print);
        break;
      case "guide":
        navigate("/guides");
        print("Opening guide...", "info");
        break;
      case "whoami":
        print(describeIdentity(identity, currentRoomId, isAuthenticated), "info");
        break;
      case "setname":
        if (!args.length) {
          print("Usage: /setname <display-name>", "warning");
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
        handleRelayCommand(args, { identity, print, currentRoomId });
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
    print("Usage: /delete <room-id>", "warning");
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
  const room = ensureRoomContext(currentRoomId, print);
  if (!room) return;

  if (!isLeader(identity, room)) {
    print("Only the leader can update the topic.", "danger");
    return;
  }

  if (!args.length) {
    if (room.topic?.trim()) {
      print(`Current topic: ${room.topic}`, "info");
    } else {
      print("No topic set for this room.", "info");
    }
    return;
  }

  if (args.length === 1 && args[0].toLowerCase() === "clear") {
    room.topic = "";
    saveRoom(room);
    touchRoom(room.id);
    print("Room topic cleared.", "success");
    return;
  }

  room.topic = args.join(" ");
  saveRoom(room);
  touchRoom(room.id);
  print(`Room topic updated to "${room.topic}".`, "success");
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

function handleRelayCommand(args, { identity, print, currentRoomId }) {
  if (args.length < 2) {
    print("Usage: /relay <room-id> [password] <message>", "warning");
    return;
  }

  const sourceRoom = ensureRoomContext(currentRoomId, print);
  if (!sourceRoom) return;
  if (getRoomRole(identity, sourceRoom) === ROOM_ROLES.GUEST) {
    print("Join this room before using /relay.", "danger");
    return;
  }

  const [targetId, ...rest] = args;
  const targetRoom = getRoom(targetId);
  if (!targetRoom) {
    print("Target room not found.", "danger");
    return;
  }

  let textParts = rest;
  if (targetRoom.password && identity.username !== targetRoom.ownerUsername) {
    if (rest.length < 2) {
      print("Usage: /relay <room-id> <password> <message>", "warning");
      return;
    }
    const suppliedPassword = rest[0];
    if (suppliedPassword !== targetRoom.password) {
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

  const history = getMessages(targetRoom.id);
  const relayMessage = {
    id: crypto.randomUUID(),
    user: `${identity.displayName} (relay)`,
    text,
    type: "message",
    timestamp: new Date().toISOString(),
  };

  saveMessages(targetRoom.id, [...history, relayMessage]);
  touchRoom(targetRoom.id);
  print(`Message relayed to ${targetRoom.name}.`, "success");
}

function handleInviteCommand(args, { currentRoomId, identity, print }) {
  if (!args.length) {
    print("Usage: /invite <username> [message]", "warning");
    return;
  }
  const room = ensureRoomContext(currentRoomId, print);
  if (!room) return;
  if (!canInvite(identity, room)) {
    print("Only leaders or co-leaders can invite.", "danger");
    return;
  }
  if (!identity.username) {
    print("Sign in before sending invites.", "danger");
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
    print("Usage: /kick <display-name>", "warning");
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

  const targetRole = normalizeRoleKey(target.role);
  const actorRole = getRoomRole(identity, room);
  if (targetRole === ROOM_ROLES.LEADER) {
    print("You cannot kick the leader.", "danger");
    return;
  }
  if (targetRole === ROOM_ROLES.CO_LEADER && actorRole !== ROOM_ROLES.LEADER) {
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
    print("Usage: /ban <display-name>", "warning");
    return;
  }
  const room = ensureRoomContext(currentRoomId, print);
  if (!room) return;
  if (!isLeader(identity, room)) {
    print("Only the leader can ban participants.", "danger");
    return;
  }

  const targetName = args.join(" ").trim();
  const target = findParticipant(room, targetName);
  if (!target) {
    print("Participant not found.", "danger");
    return;
  }
  if (normalizeRoleKey(target.role) === ROOM_ROLES.LEADER) {
    print("The leader cannot be banned.", "danger");
    return;
  }

  room.banned = room.banned ?? [];
  const exists = room.banned.some((name) => name.toLowerCase() === targetName.toLowerCase());
  if (!exists) {
    room.banned.push(targetName);
  }
  removeParticipant(room.id, {
    username: target.username,
    displayName: target.displayName,
  });
  saveRoom(room);
  touchRoom(room.id);
  print(`${targetName} has been banned from this room.`, "success");
}

function handlePromoteCommand(args, { currentRoomId, identity, print }) {
  if (!args.length) {
    print("Usage: /promote <display-name>", "warning");
    return;
  }
  const room = ensureRoomContext(currentRoomId, print);
  if (!room) return;
  if (!isLeader(identity, room)) {
    print("Only the leader can promote participants.", "danger");
    return;
  }

  const targetName = args.join(" ").trim();
  const target = findParticipant(room, targetName);
  if (!target) {
    print("Participant not found.", "danger");
    return;
  }

  const targetRole = normalizeRoleKey(target.role);
  if (targetRole === ROOM_ROLES.LEADER) {
    print("The leader cannot be promoted.", "danger");
    return;
  }
  if (targetRole === ROOM_ROLES.CO_LEADER) {
    print(`${target.displayName} is already a co-leader.`, "info");
    return;
  }

  target.role = ROOM_ROLES.CO_LEADER;
  saveRoom(room);
  touchRoom(room.id);
  print(`${target.displayName} is now a co-leader.`, "success");
}

function handleDemoteCommand(args, { currentRoomId, identity, print }) {
  if (!args.length) {
    print("Usage: /demote <display-name>", "warning");
    return;
  }
  const room = ensureRoomContext(currentRoomId, print);
  if (!room) return;
  if (!isLeader(identity, room)) {
    print("Only the leader can demote participants.", "danger");
    return;
  }

  const targetName = args.join(" ").trim();
  const target = findParticipant(room, targetName);
  if (!target) {
    print("Participant not found.", "danger");
    return;
  }

  const targetRole = normalizeRoleKey(target.role);
  if (targetRole === ROOM_ROLES.LEADER) {
    print("The leader cannot be demoted.", "danger");
    return;
  }
  if (targetRole === ROOM_ROLES.MEMBER) {
    print(`${target.displayName} is already a member.`, "info");
    return;
  }

  target.role = ROOM_ROLES.MEMBER;
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

function printHelp(print) {
  COMMAND_SECTIONS.forEach((section, index) => {
    print(`${section.title} — ${section.scope}`, "info");
    section.commands.forEach((command) => {
      print(` ${padSyntax(command.syntax)} ${command.description}`, "light");
    });
    if (index < COMMAND_SECTIONS.length - 1) {
      print("", "light");
    }
  });
}

function padSyntax(syntax) {
  if (syntax.length >= HELP_PADDING) return syntax;
  return `${syntax}${" ".repeat(HELP_PADDING - syntax.length)}`;
}

function describeIdentity(identity, currentRoomId, isAuthenticated) {
  const accountPart = identity.username
    ? `Signed in as @${identity.username}`
    : "Guest session";
  if (!currentRoomId) {
    return `${identity.displayName} — ${accountPart}. No active room selected.`;
  }
  const room = getRoom(currentRoomId);
  if (!room) {
    return `${identity.displayName} — ${accountPart}. The active room was deleted.`;
  }
  const roleLabel = formatRoleLabel(getRoomRole(identity, room));
  const authLabel = isAuthenticated ? accountPart : "Guest session";
  return `${identity.displayName} — ${roleLabel} in ${room.name}. ${authLabel}.`;
}

function getRoomRole(identity, room) {
  if (!room) return ROOM_ROLES.GUEST;
  if (identity.username && identity.username === room.ownerUsername) {
    return ROOM_ROLES.LEADER;
  }
  const participant = room.participants?.find((p) => {
    if (identity.username && p.username) {
      return p.username === identity.username;
    }
    return (p.displayName ?? "").toLowerCase() === identity.displayName.toLowerCase();
  });
  if (!participant) {
    return identity.username ? ROOM_ROLES.MEMBER : ROOM_ROLES.GUEST;
  }
  return normalizeRoleKey(participant.role);
}

function normalizeRoleKey(value) {
  if (!value) return ROOM_ROLES.MEMBER;
  const slug = String(value).replace(/[^a-z]/gi, "").toLowerCase();
  if (slug === "leader") return ROOM_ROLES.LEADER;
  if (slug === "coleader") return ROOM_ROLES.CO_LEADER;
  return ROOM_ROLES.MEMBER;
}

function formatRoleLabel(roleKey) {
  switch (roleKey) {
    case ROOM_ROLES.LEADER:
      return "Leader";
    case ROOM_ROLES.CO_LEADER:
      return "Co-leader";
    case ROOM_ROLES.MEMBER:
      return "Member";
    default:
      return "Guest";
  }
}

function hasLeadership(identity, room) {
  const role = getRoomRole(identity, room);
  return role === ROOM_ROLES.LEADER || role === ROOM_ROLES.CO_LEADER;
}

function isLeader(identity, room) {
  return getRoomRole(identity, room) === ROOM_ROLES.LEADER;
}

function canInvite(identity, room) {
  return hasLeadership(identity, room);
}

function findParticipant(room, displayName) {
  return room.participants?.find(
    (p) => (p.displayName ?? "").toLowerCase() === displayName.toLowerCase(),
  );
}
