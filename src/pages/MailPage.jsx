import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getRoomsByOwner, sendInvite, getInvitesForRecipient, getRoom } from "../utils/storage.js";

function MailPage() {
  const { identity, isAuthenticated } = useAuth();
  const [alert, setAlert] = useState(null);
  const [form, setForm] = useState({ recipient: "", roomId: "", message: "" });
  const [ownedRooms, setOwnedRooms] = useState([]);
  const [refreshStamp, setRefreshStamp] = useState(Date.now());
  const [isComposeOpen, setComposeOpen] = useState(false);

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

  const resetCompose = () => {
    setComposeOpen(false);
    setAlert(null);
    setForm({ recipient: "", roomId: "", message: "" });
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
    setTimeout(() => setAlert(null), 2000);
    resetCompose();
  };

  return (
    <section className="content-section py-5">
      <div className="section-content text-light">
        <div className="mail-toolbar d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="eyebrow text-uppercase mb-1">Mailbox</p>
            <h1 className="h4 mb-0">Your invites</h1>
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-light" onClick={() => setComposeOpen(true)}>
              Compose
            </button>
          </div>
        </div>
        <div className="mail-card p-4">
          <p className="text-white mb-4">
            Viewing invites addressed to{" "}
            <strong>{isAuthenticated ? identity.username : identity.displayName}</strong>
          </p>
          {inbox.length === 0 ? (
            <p className="text-white">No invites yet.</p>
          ) : (
            <ul className="list-unstyled mail-list mb-0">
              {inbox.map((invite) => (
                <li key={invite.id} className="mail-item">
                  <div className="d-flex justify-content-between">
                    <strong>{invite.roomName}</strong>
                    <span className="text-white small">{new Date(invite.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="mb-1 text-white small">
                    From {invite.sender} — Room ID: {invite.roomId}
                  </p>
                  <p className="mb-0 text-white">{invite.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {isComposeOpen && (
        <div className="mail-compose-overlay" role="dialog" aria-modal="true">
          <div className="mail-compose-panel">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="h5 mb-0 text-light">New invite</h3>
              <button type="button" className="btn-close-white" onClick={resetCompose}>
                ×
              </button>
            </div>
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
                <div className="mail-input-row">
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
                      className="form-select mail-room-select"
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
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-light" onClick={resetCompose}>
                  Cancel
                </button>
                <button className="btn btn-primary-glow" type="submit">
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default MailPage;

