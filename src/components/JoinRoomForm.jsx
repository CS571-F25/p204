import { useState } from "react";

function JoinRoomForm({ onJoin }) {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onJoin({ roomId, password });
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2 className="h4">Join a Room</h2>
      <div className="mb-3">
        <label htmlFor="join-room" className="form-label">
          Room ID
        </label>
        <input
          id="join-room"
          className="form-control bg-dark text-light border-secondary"
          value={roomId}
          onChange={(event) => setRoomId(event.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="join-password" className="form-label">
          Password (if required)
        </label>
        <input
          id="join-password"
          className="form-control bg-dark text-light border-secondary"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <button className="btn btn-primary-glow w-100" type="submit">
        Join Room
      </button>
    </form>
  );
}

export default JoinRoomForm;

