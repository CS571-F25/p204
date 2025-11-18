import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Terminal from "../components/Terminal.jsx";
import RoomInfoCard from "../components/RoomInfoCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import { deleteRoom, getRoom, recordRecentRoom } from "../utils/storage.js";

function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { identity, isAuthenticated } = useAuth();
  const { selectRoom } = useAppContext();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const record = roomId ? getRoom(roomId) : null;
    if (!record) {
      setError("Room not found. It might have been deleted.");
      setRoom(null);
    } else {
      setRoom(record);
      recordRecentRoom(record.id);
      setError(null);
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
        <Terminal />
        <RoomInfoCard
          room={room}
          canDelete={Boolean(room && isAuthenticated && identity.username === room.ownerUsername)}
          onDelete={handleDeleteRoom}
        />
      </div>
    </section>
  );
}

export default RoomPage;

