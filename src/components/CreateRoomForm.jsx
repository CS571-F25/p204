import { useState } from "react";

function CreateRoomForm({ onCreate, disabled }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onCreate({ name, password });
  };

  return (
    <form className="simple-form" onSubmit={handleSubmit}>
      <h2 className="h5 text-light">Create a room</h2>
      <div className="simple-field">
        <label htmlFor="room-name" className="form-label text-light">
          Room name
        </label>
        <input
          id="room-name"
          className="form-control bg-transparent text-light"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          disabled={disabled}
        />
      </div>
      <div className="simple-field">
        <label htmlFor="room-password" className="form-label text-light">
          Password (optional)
        </label>
        <input
          id="room-password"
          className="form-control bg-transparent text-light"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={disabled}
        />
        <small className="text-light opacity-75">
          Leave blank to create an open room anyone can join.
        </small>
      </div>
      <button className="btn btn-primary-glow" type="submit" disabled={disabled}>
        Create
      </button>
    </form>
  );
}

export default CreateRoomForm;

