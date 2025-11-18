import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Terminal from "../components/Terminal.jsx";
import RoomInfoCard from "../components/RoomInfoCard.jsx";
import MessageList from "../components/MessageList.jsx";
import UserList from "../components/UserList.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import {
  deleteRoom,
  getMessages,
  getRoom,
  recordRecentRoom,
  saveMessages,
  touchRoom,
  loadOlderMessages,
} from "../utils/storage.js";

const MESSAGE_KEY_PREFIX = "termrooms_messages_";
const ROOMS_STORAGE_KEY = "termrooms_rooms";
const RECENTS_STORAGE_KEY = "termrooms_recent";

function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { identity, isAuthenticated } = useAuth();
  const { selectRoom } = useAppContext();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [visibleCount, setVisibleCount] = useState(50);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [inputFeedback, setInputFeedback] = useState(null);

  useEffect(() => {
    if (!inputFeedback) return undefined;
    const timeout = setTimeout(() => setInputFeedback(null), 2000);
    return () => clearTimeout(timeout);
  }, [inputFeedback]);

  const hydrateRoom = useCallback(() => {
    const record = roomId ? getRoom(roomId) : null;
    if (!record) {
      setRoom(null);
      setError("This room no longer exists.");
      return false;
    }
    setRoom(record);
    recordRecentRoom(record.id);
    setError(null);
    const storedMessages = getMessages(record.id);
    setMessages(storedMessages);
    setVisibleCount(50);
    setCanLoadMore(storedMessages.length > 50);
    const roster = buildParticipantList(record, identity.displayName);
    setParticipants(roster);
    return true;
  }, [roomId, identity.displayName]);

  useEffect(() => {
    const ok = hydrateRoom();
    selectRoom(roomId ?? null);
    if (!ok) {
      navigate("/", { replace: true });
    }
    return () => selectRoom(null);
  }, [hydrateRoom, roomId, selectRoom, navigate]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (!roomId || !event.key) return;
      if (
        event.key === `${MESSAGE_KEY_PREFIX}${roomId}` ||
        event.key === ROOMS_STORAGE_KEY ||
        event.key === RECENTS_STORAGE_KEY
      ) {
        hydrateRoom();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [roomId, hydrateRoom]);

  const handleDeleteRoom = () => {
    if (!room) return;
    if (!isAuthenticated || identity.username !== room.ownerUsername) {
      return;
    }
    deleteRoom(room.id);
    navigate("/");
  };

  const handleSendMessage = (text) => {
    if (!room) return;
    const newMessage = {
      id: crypto.randomUUID(),
      user: identity.displayName,
      text,
      type: "message",
      timestamp: new Date().toISOString(),
    };
    const next = [...messages, newMessage];
    setMessages(next);
    saveMessages(room.id, next);
    touchRoom(room.id);
  };

  const handleLoadMore = () => {
    if (!room) return;
    const { messages: updatedMessages, loadedCount, canLoadMore } = loadOlderMessages(
      room.id,
      visibleCount
    );
    setMessages(updatedMessages);
    setVisibleCount(loadedCount);
    setCanLoadMore(canLoadMore);
  };

  return (
    <section className="content-section py-5 room-shell">
      <div className="section-content">
        <header className="room-hero glass-panel mb-4">
          <div>
            <p className="eyebrow text-muted mb-1">Room</p>
            <h1 className="room-title mb-1">{room?.name ?? roomId}</h1>
            <p className="text-muted mb-0 small">ID: {room?.id ?? "—"}</p>
          </div>
        </header>
        {error && <p className="text-danger">{error}</p>}
        <div className="room-layout">
          <div className="room-console">
            <div className="console-log">
              <MessageList
                messages={messages.slice(-visibleCount)}
                onLoadMore={canLoadMore ? handleLoadMore : null}
                canLoadMore={canLoadMore}
              />
            </div>
            <div className="console-terminal">
              <Terminal onChat={handleSendMessage} variant="embedded" onFeedback={setInputFeedback} />
            </div>
            {inputFeedback && <p className="feedback-line text-success small">{inputFeedback}</p>}
          </div>
          <aside className="room-sidebar">
            <RoomInfoCard
              room={room}
              canDelete={canDeleteOwner(room, identity, isAuthenticated)}
              onDelete={handleDeleteRoom}
            />
            <div className="divider" />
            <UserList users={participants} />
          </aside>
        </div>
      </div>
    </section>
  );
}

export default RoomPage;

function canDeleteOwner(room, identity, isAuthenticated) {
  return Boolean(room && isAuthenticated && identity.username === room.ownerUsername);
}

function buildParticipantList(room, displayName) {
  if (!room) return [];
  const roster = [
    { id: `owner-${room.ownerUsername}`, displayName: `${room.ownerDisplayName} (Owner)` },
  ];
  if (displayName && displayName !== room.ownerDisplayName) {
    roster.push({ id: "self", displayName: `${displayName} (You)` });
  }
  return roster;
}

