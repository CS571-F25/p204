import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { deleteRoom, getRoomsByOwner } from "../utils/storage.js";

function RoomsPage() {
  const { isAuthenticated, identity } = useAuth();
  const [rooms, setRooms] = useState([]);

  const refreshRooms = useCallback(() => {
    if (isAuthenticated) {
      setRooms(getRoomsByOwner(identity.username));
    } else {
      setRooms([]);
    }
  }, [isAuthenticated, identity]);

  useEffect(() => {
    refreshRooms();
  }, [refreshRooms]);

  const handleDelete = (roomId) => {
    deleteRoom(roomId);
    refreshRooms();
  };

  return (
    <section className="content-section py-5">
      <div className="section-content text-light">
        <h1 className="mb-3">Your Rooms</h1>
        {!isAuthenticated && (
          <p className="text-muted">Sign in to view and manage rooms you have created.</p>
        )}
        {isAuthenticated && rooms.length === 0 && (
          <p className="text-muted">You have not created any rooms yet. Start from the homepage.</p>
        )}
        {isAuthenticated && rooms.length > 0 && (
          <div className="row g-3">
            {rooms.map((room) => (
              <div key={room.id} className="col-12 col-md-6 col-xl-4">
                <div className="glass-panel p-4 h-100 d-flex flex-column gap-2">
                  <h2 className="h5 mb-0">{room.name}</h2>
                  <div className="room-meta small text-muted">
                    <span>ID: {room.id}</span>
                    <span>
                      Created: {new Date(room.createdAt).toLocaleDateString()}{" "}
                      {new Date(room.createdAt).toLocaleTimeString()}
                    </span>
                    <span>Password: {room.password ? room.password : "None"}</span>
                  </div>
                  <small className="text-muted">
                    Password: {room.password ? room.password : "None"}
                  </small>
                  <div className="mt-auto d-flex gap-2">
                    <Link to={`/room/${room.id}`} className="btn btn-primary-glow flex-grow-1">
                      Open
                    </Link>
                    <button className="btn btn-outline-danger" onClick={() => handleDelete(room.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RoomsPage;

