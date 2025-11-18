import { useState } from "react";

function CommandInput({ onSubmit }) {
  const [value, setValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex gap-2">
      <label htmlFor="terminal-input" className="visually-hidden">
        Terminal command
      </label>
      <input
        id="terminal-input"
        className="form-control form-control-lg bg-dark text-light border-secondary"
        placeholder="Type commands like /help"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoComplete="off"
      />
      <button className="btn btn-light btn-lg" type="submit">
        Enter
      </button>
    </form>
  );
}

export default CommandInput;

