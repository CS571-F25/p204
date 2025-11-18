import { useEffect, useState } from "react";
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

  useEffect(() => {
    const record = roomId ? getRoom(roomId) : null;
    if (!record) {
      setError("Room not found. It might have been deleted.");
      setRoom(null);
    } else {
      setRoom(record);
      recordRecentRoom(record.id);
      setError(null);
      const storedMessages = getMessages(record.id);
      setMessages(storedMessages);
      setVisibleCount(50);
      setCanLoadMore(storedMessages.length > 50);
      const roster = buildParticipantList(record, identity.displayName);
      setParticipants(roster);
    }
    selectRoom(roomId ?? null);
    return () => selectRoom(null);
  }, [roomId, selectRoom, identity.displayName]);

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
    <section className="content-section py-5">
      <div className="section-content">
        <h1>Room View</h1>
        {error && <p className="text-danger">{error}</p>}
        {!error && (
          <p className="text-muted">
            You are viewing <strong>{room?.name ?? roomId}</strong>. Use the terminal below to run
            commands or chat once messaging is enabled.
          </p>
        )}
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="glass-panel p-4 mb-4">
              <MessageList
                messages={messages.slice(-visibleCount)}
                onLoadMore={canLoadMore ? handleLoadMore : null}
                canLoadMore={canLoadMore}
              />
            </div>
            <div className="glass-panel p-4">
              <Terminal onChat={handleSendMessage} />
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="glass-panel p-4 mb-4">
              <RoomInfoCard
                room={room}
                canDelete={Boolean(room && isAuthenticated && identity.username === room.ownerUsername)}
                onDelete={handleDeleteRoom}
              />
            </div>
            <div className="glass-panel p-4">
              <UserList users={participants} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RoomPage;

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

