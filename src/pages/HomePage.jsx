import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import CreateRoomForm from "../components/CreateRoomForm.jsx";
import JoinRoomForm from "../components/JoinRoomForm.jsx";
import HelpPanel from "../components/HelpPanel.jsx";
import {
  createRoomRecord,
  getRoom,
  recordRecentRoom,
  roomPasswordMatches,
} from "../utils/storage.js";

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, identity } = useAuth();
  const [alert, setAlert] = useState(null);

  const showAlert = (variant, message) => setAlert({ variant, message });

  const handleCreateRoom = ({ name, password }) => {
    if (!isAuthenticated) {
      showAlert("warning", "You must be signed in to create a room.");
      return;
    }

    try {
      const room = createRoomRecord({
        name: name.trim(),
        password: password.trim(),
        ownerUsername: identity.username,
        ownerDisplayName: identity.displayName,
      });
      showAlert("success", `Room "${room.name}" created. Redirecting you there now...`);
      navigate(`/room/${room.id}`);
    } catch (error) {
      showAlert("danger", error.message);
    }
  };

  const handleJoinRoom = ({ roomId, password }) => {
    const normalizedId = roomId.trim().toLowerCase();
    const room = getRoom(normalizedId);
    if (!room) {
      showAlert("danger", "Room not found. Double-check the ID.");
      return;
    }

    if (!roomPasswordMatches(room, password.trim())) {
      showAlert("danger", "Incorrect password.");
      return;
    }

    recordRecentRoom(room.id);
    showAlert("success", `Joining room "${room.name}".`);
    navigate(`/room/${room.id}`);
  };

  return (
    <section className="content-section py-5">
      <div className="section-content text-light">
        <h1 className="text-light">TermRooms Home</h1>
        <p className="text-muted">
          Create new rooms (if signed in) or join existing ones using the forms below. You can always
          use the terminal commands as well if you prefer the keyboard-driven experience.
        </p>

        {alert && (
          <div className={`alert alert-${alert.variant}`} role="alert">
            {alert.message}
          </div>
        )}

        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <CreateRoomForm onCreate={handleCreateRoom} disabled={!isAuthenticated} />
          </div>
          <div className="col-12 col-lg-6">
            <JoinRoomForm onJoin={handleJoinRoom} />
          </div>
        </div>

        <HelpPanel />
      </div>
    </section>
  );
}

export default HomePage;

