const ACCOUNTS_KEY = "termrooms_accounts";
const SESSION_KEY = "termrooms_session";
const ROOMS_KEY = "termrooms_rooms";
const MESSAGES_PREFIX = "termrooms_messages_";
const RECENTS_KEY = "termrooms_recent";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Failed to read ${key} from localStorage`, err);
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* -------------------------------------------------------------------------- */
/* Accounts & Sessions                                                         */
/* -------------------------------------------------------------------------- */

export function getAccounts() {
  return readJSON(ACCOUNTS_KEY, []);
}

export function saveAccounts(accounts) {
  writeJSON(ACCOUNTS_KEY, accounts);
}

export function findAccount(username) {
  return getAccounts().find((acct) => acct.username === username);
}

export function createAccount({ username, pin, displayName }) {
  const existing = findAccount(username);
  if (existing) {
    throw new Error("Username already exists");
  }

  const newAccount = {
    id: crypto.randomUUID(),
    username,
    pinHash: pin, // NOTE: For class project simplicity. Replace with real hashing later.
    displayName,
    createdAt: new Date().toISOString(),
  };

  const accounts = getAccounts();
  accounts.push(newAccount);
  saveAccounts(accounts);
  return newAccount;
}

export function authenticate(username, pin) {
  const account = findAccount(username);
  if (!account || account.pinHash !== pin) {
    throw new Error("Invalid credentials");
  }
  return account;
}

export function updateAccountDisplayName(username, displayName) {
  const accounts = getAccounts();
  const idx = accounts.findIndex((acct) => acct.username === username);
  if (idx === -1) return;
  accounts[idx].displayName = displayName;
  saveAccounts(accounts);
}

export function saveSession(session) {
  writeJSON(SESSION_KEY, session);
}

export function getSession() {
  return readJSON(SESSION_KEY, null);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/* -------------------------------------------------------------------------- */
/* Rooms & Messages (stubbed for future steps)                                 */
/* -------------------------------------------------------------------------- */

export function getRooms() {
  return readJSON(ROOMS_KEY, []);
}

export function saveRooms(rooms) {
  writeJSON(ROOMS_KEY, rooms);
}

export function saveRoom(room) {
  const rooms = getRooms();
  const idx = rooms.findIndex((r) => r.id === room.id);
  if (idx === -1) {
    rooms.push(room);
  } else {
    rooms[idx] = room;
  }
  saveRooms(rooms);
}

export function getMessages(roomId) {
  return readJSON(`${MESSAGES_PREFIX}${roomId}`, []);
}

export function saveMessages(roomId, messages) {
  writeJSON(`${MESSAGES_PREFIX}${roomId}`, messages);
}

export function getRecents() {
  return readJSON(RECENTS_KEY, []);
}

export function saveRecents(recents) {
  writeJSON(RECENTS_KEY, recents);
}

