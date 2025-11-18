import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import CreateRoomForm from "../components/CreateRoomForm.jsx";
import JoinRoomForm from "../components/JoinRoomForm.jsx";
import {
  createRoomRecord,
  deleteRoom,
  getRoom,
  getRoomsByOwner,
  recordRecentRoom,
  roomPasswordMatches,
  addParticipant,
  getRecents,
} from "../utils/storage.js";

function RoomsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, identity } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [recentRooms, setRecentRooms] = useState([]);
  const [alert, setAlert] = useState(null);

  const refreshRooms = useCallback(() => {
    if (isAuthenticated) {
      setRooms(getRoomsByOwner(identity.username));
    } else {
      setRooms([]);
    }
    const recents = getRecents()
      .map((id) => getRoom(id))
      .filter(Boolean);
    setRecentRooms(recents);
  }, [isAuthenticated, identity]);

  useEffect(() => {
    refreshRooms();
  }, [refreshRooms]);

  const handleDelete = (roomId) => {
    deleteRoom(roomId);
    refreshRooms();
  };

  const handleCreateRoom = ({ name, password }) => {
    if (!isAuthenticated) {
      setAlert({ variant: "warning", message: "Sign in to create rooms." });
      return;
    }
    try {
      const room = createRoomRecord({
        name: name.trim(),
        password: password.trim(),
        ownerUsername: identity.username,
        ownerDisplayName: identity.displayName,
      });
      setAlert({ variant: "success", message: `Room "${room.name}" created.` });
      refreshRooms();
      navigate(`/room/${room.id}`);
    } catch (error) {
      setAlert({ variant: "danger", message: error.message });
    }
  };

  const handleJoinRoom = ({ roomId, password }) => {
    const lookup = getRoom(roomId.trim().toLowerCase());
    if (!lookup) {
      setAlert({ variant: "danger", message: "Room not found." });
      return;
    }
    if (!roomPasswordMatches(lookup, password.trim())) {
      setAlert({ variant: "danger", message: "Incorrect password." });
      return;
    }
    recordRecentRoom(lookup.id);
    addParticipant(lookup.id, {
      username: isAuthenticated ? identity.username : null,
      displayName: identity.displayName,
    });
    setAlert({ variant: "success", message: `Joining "${lookup.name}".` });
    navigate(`/room/${lookup.id}`);
  };

  return (
    <section className="content-section py-5">
      <div className="section-content text-light">
        <h1 className="mb-3">Rooms</h1>
        <p className="text-muted">
          Create, join, and manage every room you own. Actions you take here sync instantly across
          open tabs.
        </p>

        {alert && (
          <div className={`alert alert-${alert.variant}`} role="alert">
            {alert.message}
          </div>
        )}

        <div className="rooms-actions row g-4 mb-4">
          <div className="col-12 col-lg-6">
            <CreateRoomForm onCreate={handleCreateRoom} disabled={!isAuthenticated} />
          </div>
          <div className="col-12 col-lg-6">
            <JoinRoomForm onJoin={handleJoinRoom} />
          </div>
        </div>

        {!isAuthenticated && (
          <p className="text-muted">Sign in to view and manage rooms you have created.</p>
        )}

        {isAuthenticated && (
          <div className="room-listing">
            <h2 className="h5 text-light">Rooms you created</h2>
            {rooms.length === 0 && (
              <p className="text-muted mb-3">No rooms yet. Create one using the form above.</p>
            )}
            {rooms.length > 0 && (
              <ul className="list-unstyled mb-4">
                {rooms.map((room) => (
                  <li key={room.id} className="room-list-item d-flex flex-column flex-md-row">
                    <div className="flex-grow-1">
                      <p className="mb-1 text-light fw-semibold">{room.name}</p>
                      <div className="small text-muted d-flex flex-wrap gap-3">
                        <span>ID: {room.id}</span>
                        <span>Created: {new Date(room.createdAt).toLocaleString()}</span>
                        <span>Password: {room.password ? room.password : "None"}</span>
                      </div>
                    </div>
                    <div className="d-flex gap-2 mt-2 mt-md-0">
                      <Link to={`/room/${room.id}`} className="btn btn-outline-light btn-sm">
                        Open
                      </Link>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(room.id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <h2 className="h5 text-light">Recently joined</h2>
            {recentRooms.length === 0 && (
              <p className="text-muted">Rooms you enter will show up here.</p>
            )}
            {recentRooms.length > 0 && (
              <ul className="list-unstyled">
                {recentRooms.map((room) => (
                  <li key={`recent-${room.id}`} className="room-list-item d-flex justify-content-between">
                    <span>{room.name}</span>
                    <Link to={`/room/${room.id}`} className="btn btn-outline-light btn-sm">
                      Reopen
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default RoomsPage;

