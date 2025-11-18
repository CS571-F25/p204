import { useEffect, useRef, useState } from "react";

function CommandInput({ onSubmit }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="terminal-input-shell">
      <label htmlFor="terminal-input" className="visually-hidden">
        Terminal command
      </label>
      <span aria-hidden="true" className="terminal-prompt">
        $
      </span>
      <input
        id="terminal-input"
        className="terminal-input"
        placeholder=""
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoComplete="off"
        ref={inputRef}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setValue("");
          }
        }}
      />
    </form>
  );
}

export default CommandInput;

