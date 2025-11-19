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
  saveRoom,
  getRoomsByParticipant,
  getSubscribedRooms,
} from "../utils/storage.js";

function RoomsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, identity } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [recentRooms, setRecentRooms] = useState([]);
  const [alert, setAlert] = useState(null);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editName, setEditName] = useState("");
  const [joinedRooms, setJoinedRooms] = useState([]);

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
    const participantProfile = {
      username: isAuthenticated ? identity.username : null,
      displayName: identity.displayName,
    };
    const membership = getRoomsByParticipant(participantProfile).filter((room) => {
      if (!participantProfile.username) return room.ownerUsername !== null;
      return room.ownerUsername !== participantProfile.username;
    });
    const subscribed = getSubscribedRooms(participantProfile).filter((room) => room);
    const combinedMap = new Map();
    [...membership, ...subscribed].forEach((room) => {
      if (!room) return;
      if (
        participantProfile.username &&
        room.ownerUsername === participantProfile.username
      ) {
        return;
      }
      combinedMap.set(room.id, room);
    });
    setJoinedRooms(Array.from(combinedMap.values()));
  }, [isAuthenticated, identity]);

  useEffect(() => {
    refreshRooms();
  }, [refreshRooms]);

  const handleDelete = (roomId) => {
    deleteRoom(roomId);
    refreshRooms();
  };

  const handleRenameSave = (roomId) => {
    const target = getRoom(roomId);
    if (!target || !editName.trim()) {
      setAlert({ variant: "warning", message: "Room name cannot be empty." });
      return;
    }
    saveRoom({ ...target, name: editName.trim() });
    setAlert({ variant: "success", message: "Room name updated." });
    setEditingRoomId(null);
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
      role: "member",
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
                    <div className="d-flex gap-2 mt-2 mt-md-0 align-items-center">
                      <Link to={`/room/${room.id}`} className="icon-btn" title="Open room">
                        <ArrowIcon />
                      </Link>
                      <button
                        type="button"
                        className="icon-btn"
                        title="Edit room"
                        onClick={() => {
                          setEditingRoomId(room.id);
                          setEditName(room.name);
                        }}
                      >
                        <EditIcon />
                      </button>
                    </div>
                    {editingRoomId === room.id && (
                      <div className="room-edit-panel mt-3 w-100">
                        <label htmlFor={`rename-${room.id}`} className="form-label text-muted small">
                          Room name
                        </label>
                        <input
                          id={`rename-${room.id}`}
                          className="form-control mb-2"
                          value={editName}
                          onChange={(event) => setEditName(event.target.value)}
                        />
                        <div className="d-flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="btn btn-primary-glow btn-sm"
                            onClick={() => handleRenameSave(room.id)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-light btn-sm"
                            onClick={() => setEditingRoomId(null)}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              handleDelete(room.id);
                              setEditingRoomId(null);
                            }}
                          >
                            Delete room
                          </button>
                        </div>
                      </div>
                    )}
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
            <h2 className="h5 text-light mt-4">Rooms you're part of</h2>
            {joinedRooms.length === 0 && (
              <p className="text-muted">Join a room to see it listed here.</p>
            )}
            {joinedRooms.length > 0 && (
              <ul className="list-unstyled mb-0">
                {joinedRooms.map((room) => (
                  <li key={`joined-${room.id}`} className="room-list-item d-flex justify-content-between">
                    <div>
                      <strong>{room.name}</strong>
                      <span className="text-white-50 small ms-2">Leader: {room.ownerDisplayName}</span>
                    </div>
                    <Link to={`/room/${room.id}`} className="btn btn-outline-light btn-sm">
                      Open
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

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 8h8m0 0-3-3m3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m9.5 3.5 3 3L6 13H3v-3l6.5-6.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

