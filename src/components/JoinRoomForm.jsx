import { useState } from "react";

function JoinRoomForm({ onJoin }) {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onJoin({ roomId, password });
  };

  return (
    <form className="simple-form" onSubmit={handleSubmit}>
      <h2 className="h5 text-light">Join a room</h2>
      <div className="simple-field">
        <label htmlFor="join-room" className="form-label text-light">
          Room ID
        </label>
        <input
          id="join-room"
          className="form-control bg-transparent text-light"
          value={roomId}
          onChange={(event) => setRoomId(event.target.value)}
          required
        />
      </div>
      <div className="simple-field">
        <label htmlFor="join-password" className="form-label text-light">
          Password (if required)
        </label>
        <input
          id="join-password"
          className="form-control bg-transparent text-light"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <button className="btn btn-primary-glow" type="submit">
        Join
      </button>
    </form>
  );
}

export default JoinRoomForm;

