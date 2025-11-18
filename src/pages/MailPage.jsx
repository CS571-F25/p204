import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getRoomsByOwner, sendInvite, getInvitesForRecipient, getRoom } from "../utils/storage.js";

function MailPage() {
  const { identity, isAuthenticated } = useAuth();
  const [alert, setAlert] = useState(null);
  const [form, setForm] = useState({ recipient: "", roomId: "", message: "" });
  const [ownedRooms, setOwnedRooms] = useState([]);
  const [refreshStamp, setRefreshStamp] = useState(Date.now());

  useEffect(() => {
    if (isAuthenticated) {
      setOwnedRooms(getRoomsByOwner(identity.username));
    } else {
      setOwnedRooms([]);
    }
  }, [identity, isAuthenticated]);

  const inbox = useMemo(() => {
    const key = isAuthenticated ? identity.username : identity.displayName;
    return getInvitesForRecipient(key).map((invite) => ({
      ...invite,
      roomName: getRoom(invite.roomId)?.name ?? invite.roomId,
    }));
  }, [identity, isAuthenticated, refreshStamp]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.recipient.trim() || !form.roomId.trim()) {
      setAlert({ variant: "warning", message: "Recipient and room ID are required." });
      return;
    }

    sendInvite({
      roomId: form.roomId.trim().toLowerCase(),
      recipient: form.recipient.trim(),
      message: form.message.trim() || `${identity.displayName} invited you to collaborate.`,
      sender: identity.displayName,
    });
    setAlert({ variant: "success", message: "Invite sent." });
    setForm((prev) => ({ ...prev, message: "" }));
    setRefreshStamp(Date.now());
  };

  return (
    <section className="content-section py-5">
      <div className="section-content text-light">
        <div className="row g-4">
          <div className="col-12 col-lg-5">
            <div className="mail-card p-4 h-100">
              <h1 className="h4 mb-3">Send an invite</h1>
              <p className="text-muted mb-4">
                Share a room ID with another TermRooms user. Invites stay local to this browser for now.
              </p>
              {alert && (
                <div className={`alert alert-${alert.variant}`} role="alert">
                  {alert.message}
                </div>
              )}
              <form className="mail-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="invite-recipient" className="form-label">
                    Recipient username
                  </label>
                  <input
                    id="invite-recipient"
                    name="recipient"
                    className="form-control"
                    value={form.recipient}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="invite-room" className="form-label">
                    Room ID
                  </label>
                  <div className="d-flex gap-2">
                    <input
                      id="invite-room"
                      name="roomId"
                      className="form-control"
                      value={form.roomId}
                      onChange={handleChange}
                      required
                    />
                    {ownedRooms.length > 0 && (
                      <select
                        className="form-select flex-shrink-0 mail-room-select"
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, roomId: event.target.value }))
                        }
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Owned rooms
                        </option>
                        {ownedRooms.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="invite-message" className="form-label">
                    Message (optional)
                  </label>
                  <textarea
                    id="invite-message"
                    name="message"
                    className="form-control"
                    rows={3}
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>
                <button className="btn btn-primary-glow w-100" type="submit">
                  Send Invite
                </button>
              </form>
            </div>
          </div>
          <div className="col-12 col-lg-7">
            <div className="mail-card p-4 h-100">
              <h2 className="h5 mb-3">Your inbox</h2>
              <p className="text-muted mb-4">
                Viewing invites addressed to{" "}
                <strong>{isAuthenticated ? identity.username : identity.displayName}</strong>
              </p>
              {inbox.length === 0 ? (
                <p className="text-muted">No invites yet.</p>
              ) : (
                <ul className="list-unstyled mail-list mb-0">
                  {inbox.map((invite) => (
                    <li key={invite.id} className="mail-item">
                      <div className="d-flex justify-content-between">
                        <strong>{invite.roomName}</strong>
                        <span className="text-muted small">
                          {new Date(invite.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="mb-1 text-muted small">
                        From {invite.sender} — Room ID: {invite.roomId}
                      </p>
                      <p className="mb-0">{invite.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MailPage;

