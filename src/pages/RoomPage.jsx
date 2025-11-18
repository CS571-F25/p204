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
    }
    selectRoom(roomId ?? null);
    return () => selectRoom(null);
  }, [roomId, selectRoom]);

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
    setVisibleCount((prev) => Math.min(prev + 25, messages.length));
  };

  return (
    <section className="py-5">
      <div className="container">
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
            <MessageList
              messages={messages.slice(-visibleCount)}
              onLoadMore={visibleCount < messages.length ? handleLoadMore : null}
              canLoadMore={visibleCount < messages.length}
            />
            <Terminal onChat={handleSendMessage} />
          </div>
          <div className="col-12 col-lg-4">
            <RoomInfoCard
              room={room}
              canDelete={Boolean(room && isAuthenticated && identity.username === room.ownerUsername)}
              onDelete={handleDeleteRoom}
            />
            <UserList users={[]} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default RoomPage;

