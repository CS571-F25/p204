import { useState } from "react";

function CreateRoomForm({ onCreate, disabled }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onCreate({ name, password });
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2 className="h4">Create a Room</h2>
      <div className="mb-3">
        <label htmlFor="room-name" className="form-label">
          Room name
        </label>
        <input
          id="room-name"
          className="form-control bg-dark text-light border-secondary"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          disabled={disabled}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="room-password" className="form-label">
          Password (optional)
        </label>
        <input
          id="room-password"
          className="form-control bg-dark text-light border-secondary"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={disabled}
        />
        <div className="form-text text-light">
          Leave blank to create an open room anyone can join.
        </div>
      </div>
      <button className="btn btn-primary-glow w-100" type="submit" disabled={disabled}>
        Create Room
      </button>
    </form>
  );
}

export default CreateRoomForm;

