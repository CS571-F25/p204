# TermRooms - Project Specification

## Project Overview

**TermRooms** is a web-based terminal-style interface for creating and managing virtual "rooms" where users can interact through command-line-style commands. The application runs entirely in the browser using React, with data persistence via localStorage.

- ### **User Model: Simple Accounts + Guest Mode**

- **Registered Users**:
  - Create a lightweight local account (username + 4-digit PIN stored in localStorage).
  - Required to create or delete rooms.
  - Choose a display name shown in chat logs.
- **Guests**:
  - Join rooms without registering.
  - Can send messages but cannot create or delete rooms.
  - Assigned auto nickname `Guest-####`, changeable via `/setname`.
- **Sign-Up / Login Flow**:
  - Handled entirely through the `/auth` page (React Bootstrap forms). These flows are **outside** the terminal; users do not type `/signup` or `/login`.
  - Session saved in `termrooms_session`; a logout button in the Navbar clears it.
- **Permissions Summary**:
  - Create/Delete room → registered owners only.
  - Messaging/Join rooms → all roles (respecting room password if set).

---

## Design Philosophy

### **Minimal & Optimal**

- **No External Dependencies**: Uses only React, React Router, and React Bootstrap
- **Browser-Native Storage**: localStorage for persistence (built into browsers)
- **Single-Session Focus**: Designed for individual user sessions with room persistence
- **Clean Architecture**: Well-organized components following React best practices
- **Progressive Enhancement**: Start simple, add features incrementally

### **How It Works**

1. **Room Creation**: User creates a room with a name (optional password)
2. **Room Storage**: Room data stored in localStorage with unique ID
3. **Room Joining**: User can join any room by entering its ID
4. **Command Interface**: Terminal-style input processes commands
5. **Message History**: Messages stored in localStorage per room
6. **Session Persistence**: Rooms and messages persist across browser sessions

---

## Vision & Proposal Alignment

TermRooms reimagines real-time collaboration through a terminal-inspired UI. A single command input drives every interaction—users sign up, create rooms, join rooms, and chat entirely through concise commands (`/signup`, `/create`, `/join`, `/msg`). The surrounding layout keeps things simple: the primary terminal sits beside contextual cards for room info and guides. Each room surfaces ownership metadata, optional passwords, and persistent history, while the homepage doubles as a command center with onboarding content. The experience stays minimal and fast—mirroring the original proposal—yet still meets the CS571 interactive requirements by featuring multiple pages, routed views, and meaningful components.

---

## Tech Stack

### **Core Technologies** (Already Installed)

- **React 19** - UI framework
- **React Router 7** - Client-side routing
- **React Bootstrap 2** - UI components and styling
- **Bootstrap 5** - CSS framework
- **Vite** - Build tool and dev server
- **LocalStorage** - Only persistence layer (no Firebase/backend to keep scope manageable)

### **Browser APIs** (No Installation Needed)

- **localStorage** - Data persistence
- **URL API** - Room ID handling
- **Date API** - Timestamps

### **Why Not Firebase (Yet)?**

- Check-in scope focuses on a fully static React app deployable to GitHub Pages with no backend.
- LocalStorage keeps implementation simple and meets the course rubric (no real-time requirement).
- The data-layer code (`storage.js`) is isolated so it can be swapped for Firebase later if multi-device sync becomes a priority.

---

## Architecture & Data Flow

### **State Management Strategy**

1. **Local Component State**: Use `useState` for component-specific data
2. **Context API**: 
   - `AuthContext` for current session, role, and auth actions
   - `AppContext` for active room panels, theme, global modals
3. **localStorage**: Persist rooms, messages, user preferences, accounts
4. **URL Parameters**: Room ID in route (`/room/:roomId`)

### **Data Flow**

```
User Action → Component Handler → Update State → Save to localStorage → Re-render UI
```

### **Data Structure**

#### **User & Account Model**

- `termrooms_accounts`: `{ id, username, displayName, pinHash, createdAt }`
- `termrooms_session`: `{ userId, displayName, role }`
- `termrooms_guest_session`: `{ guestId, nickname }`
- Roles:
  - `owner`: room creator with delete privilege
  - `member`: logged-in participant (non-owner)
  - `guest`: anonymous participant
- Permissions summary:
  - Create/Delete room → owners (registered) only
  - Messaging / joining → everyone (respecting room password)
  - Rooms cannot be renamed/locked after creation (keep flow simple)

#### **localStorage Keys**

```javascript
// Accounts
'termrooms_accounts' = [
  {
    id: "user_123",
    username: "yazod",
    displayName: "Yazod A.",
    pinHash: "hashed-1234",
    createdAt: "2025-10-20T14:00:00Z"
  }
]

// Room storage
'termrooms_rooms' = [
  {
    id: "abc123",
    name: "My Room",
    password: "secret123", // optional, plain text for simplicity
    createdAt: "2025-11-01T10:00:00Z",
    ownerId: "user_123",
    createdBy: "JohnDoe", // display name of creator
    lastActiveAt: "2025-11-01T10:30:00Z",
    isArchived: false
  }
]

// Messages per room
'termrooms_messages_abc123' = [
  {
    id: "msg1",
    text: "Hello!",
    user: "JohnDoe", // display name
    timestamp: "2025-11-01T10:01:00Z",
    type: "message", // "message" | "command" | "system"
    // Note: No "to" or "recipient" field - messages are broadcast to room
    roomId: "abc123" // room where message was sent
  }
]

// User preferences
'termrooms_username' = "JohnDoe" // deprecated in favor of session but retained for quick nickname edits
'termrooms_recent' = ["abc123", "def456", "ghi789"]
'termrooms_session' = {
  userId: "user_123",
  displayName: "Yazod A.",
  role: "owner",
  lastLogin: "2025-11-02T09:00:00Z"
}
'termrooms_guest_session' = {
  guestId: "guest_8392",
  nickname: "Guest-8392"
}
```

---

## File Structure

```
p204-project/
├── public/
│   └── vite.svg
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Terminal.jsx
│   │   ├── CommandInput.jsx
│   │   ├── TerminalOutput.jsx
│   │   ├── MessageList.jsx
│   │   ├── MessageItem.jsx
│   │   ├── UserList.jsx
│   │   ├── UserItem.jsx
│   │   ├── RoomCard.jsx
│   │   ├── CreateRoomForm.jsx
│   │   ├── JoinRoomForm.jsx
│   │   ├── RoomInfoCard.jsx
│   │   ├── HelpPanel.jsx
│   │   ├── PasswordModal.jsx
│   │   └── AuthForm.jsx
│   ├── pages/               # Page-level components (routes)
│   │   ├── HomePage.jsx
│   │   ├── RoomPage.jsx
│   │   ├── GuidePage.jsx
│   │   └── AuthPage.jsx
│   ├── context/             # React Context for shared state
│   │   ├── AppContext.jsx
│   │   └── AuthContext.jsx
│   ├── utils/               # Helper functions
│   │   ├── storage.js      # localStorage helpers
│   │   ├── commands.js     # Command parsing/handling
│   │   └── roomUtils.js    # Room management utilities
│   ├── App.jsx              # Main app component with routing
│   ├── App.css              # App-specific styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── docs/                    # Build output (for GitHub Pages)
├── index.html
├── package.json
├── vite.config.js
└── spec.md
```

---

## Component Breakdown

### **What Counts as a Component?**

A component is a **reusable piece of UI** that:
- Has its own file (`.jsx`)
- Can be imported and used multiple times
- Manages its own state or receives props
- Returns JSX

### **Page Components** (4 components - React Router routes)

1. **HomePage** (`src/pages/HomePage.jsx`)
   - Route: `/`
   - Purpose: Dashboard for creating/joining rooms
   - Contains: CreateRoomForm, JoinRoomForm, RoomCard list, HelpPanel
   - Optional: Username input/setting form (if username not set)

2. **RoomPage** (`src/pages/RoomPage.jsx`)
   - Route: `/room/:roomId`
   - Purpose: Main room interface
   - Contains: Terminal (single command input), MessageList, UserList, RoomInfoCard
   - One focused terminal drives all actions; supporting cards show metadata and participants

3. **GuidePage** (`src/pages/GuidePage.jsx`)
   - Route: `/guides`
   - Purpose: Learning hub with onboarding content, command reference, and design rationale
   - Contains: Interactive walkthrough, command glossary, accessibility checklist preview
   - Provides static content required for the "3+ pages" milestone while reinforcing the terminal metaphor

4. **AuthPage** (`src/pages/AuthPage.jsx`)
   - Route: `/auth` (Tabs for Sign Up / Log In)
   - Purpose: Manage account creation, login, and guest entry
   - Contains: SignUpForm, LoginForm, GuestEntryCard
   - Uses React Bootstrap tabs + forms, integrates with AuthContext

### **Reusable Components** (12+ components)

#### **Navigation & Layout**
1. **Navbar** (`src/components/Navbar.jsx`)
   - Navigation bar with links to Home and current room
   - Shows username if set
   - Required by project spec

#### **Terminal Components**
2. **Terminal** (`src/components/Terminal.jsx`)
   - Main terminal container
   - Combines CommandInput and TerminalOutput
   - Orchestrates command execution by calling command parser/executor from `commands.js`
   - Shows contextual feedback for each command

3. **CommandInput** (`src/components/CommandInput.jsx`)
   - Input field for typing commands
   - Handles Enter key, command history (Up/Down arrows)
   - Auto-focus on mount

4. **TerminalOutput** (`src/components/TerminalOutput.jsx`)
   - Displays the last few command outputs (success/error/info)
   - Scrollable area capped to ~20 entries
   - Clearing output does not affect chat messages

#### **Message Components**
5. **MessageList** (`src/components/MessageList.jsx`)
   - Container for displaying all messages in a room
   - Scrollable, auto-scrolls to bottom
   - Displays messages for the current room (filtered by roomId prop)

6. **MessageItem** (`src/components/MessageItem.jsx`)
   - Individual message display
   - Shows username (or "Anonymous"), text, timestamp
   - Different styling based on message type (message/command/system)
   - Receives message object with user, text, timestamp, type fields

#### **User Components**
7. **UserList** (`src/components/UserList.jsx`)
   - Sidebar showing active users in room
   - Currently shows current user (single-session)

8. **UserItem** (`src/components/UserItem.jsx`)
   - Individual user display
   - Shows username, status indicator

#### **Room Management Components**
9. **RoomCard** (`src/components/RoomCard.jsx`)
   - Card displaying room info on homepage
   - Shows room name, ID, message count
   - Join shortcut button

10. **RoomInfoCard** (`src/components/RoomInfoCard.jsx`)
    - Displays active room metadata (owner, created date, password status)
    - Includes delete button for owner and leave button for others

11. **CreateRoomForm** (`src/components/CreateRoomForm.jsx`)
    - Form for creating new room (name + optional password)
    - Validates auth status and input

12. **JoinRoomForm** (`src/components/JoinRoomForm.jsx`)
    - Form for joining existing room (ID + optional password)
    - Validates room existence before navigation

13. **PasswordModal** (`src/components/PasswordModal.jsx`)
    - Modal prompt for entering room password when required

#### **Auth & Support Components**
14. **AuthForm** (`src/components/AuthForm.jsx`)
    - Single component that toggles between sign up / log in modes
    - Handles username, PIN, and display name inputs

15. **HelpPanel** (`src/components/HelpPanel.jsx`)
    - Displays available commands and usage
    - Collapsible accordion or modal
    - Links to GuidePage anchors

**Total: 15 components** (comfortably exceeds 12 requirement)

---

## Feature Design

### **Core Commands**

Commands are parsed from user input starting with `/`. Commands can be executed from:
- **Forms on HomePage**: Primary method for `/create` and `/join` via CreateRoomForm and JoinRoomForm
- **Terminal in RoomPage**: Alternative method - all commands can be typed in the terminal

Commands use simple argument syntax (no flags). The single terminal input is the canonical way to interact, with forms providing optional fallbacks. Authentication is handled outside the terminal, so the command list starts with room actions.

#### Identity Commands
1. **`/setname [display-name]`**
   - Updates display name (persists for logged-in users; temporary for guests)

2. **`/whoami`**
   - Shows current identity and role

#### Room Commands
3. **`/create [room-name] [password]`** *(registered only)*
   - Generates unique 6-character ID and optional password
   - Sets caller as owner

4. **`/join [room-id-or-name] [password]`**
   - Joins by ID; if a name is provided, resolves to the most recent matching room

5. **`/leave`**
   - Leaves the current room and returns to Home

6. **`/delete [room-id]`** *(owner only)*
   - Immediately removes the room and its messages from localStorage

7. **`/rooms`**
    - Lists rooms you own plus the last few rooms you joined

#### Messaging & Support Commands
8. **`/msg [message]`** or plain text
    - Broadcasts to current room

9. **`/users`**
    - Lists active participants in the current room

10. **`/help [topic]`**
    - Command reference (topics: auth, rooms, chat)

11. **`/guide [section]`**
    - Opens GuidePage to requested section

12. **`/history [count]`**
    - Loads additional chat messages (default 25, max 100)
    - Same effect as pressing the “Load 25 earlier messages” button

13. **`/clear`**
    - Clears terminal output locally (does not delete chat history)

### **Messaging Model**

**Room-Based Broadcasting**: Messages are sent to rooms, not to specific users. This is similar to a chat room or IRC channel - all messages are public to everyone in that room.

- **No Direct Messages**: There is no user-to-user private messaging
- **No Recipients**: Messages don't have a "to" field - they're broadcast to the room
- **Room Visibility**: All users viewing a room see all messages in that room
- **Simple Design**: Keeps the implementation minimal and avoids complex user management
- **Message Loading**:
  - When you enter a room, the latest 50 messages load instantly from localStorage and render in the chat list.
  - A “Load 25 earlier messages” button (label includes the count) appears when older messages exist; each press loads another 25 until history is exhausted.
  - The `/history [count]` command mirrors the button but lets the user specify the count (default 25, capped at 100 per call).
  - Terminal output only shows command results; chat history stays separate.

### **Message Types**

Messages have a `type` field that determines their purpose and styling:

- **`"message"`**: User messages sent via `/msg` or plain text input
  - Broadcast to the entire room (no specific recipient)
  - Displayed in message list with username and timestamp
  - Normal message styling
  
- **`"command"`**: Command execution outputs
  - Examples: `/help` output, `/users` output, command confirmations
  - Displayed in terminal/command history
  - May have different styling (monospace, terminal colors)
  
- **`"system"`**: System notifications and events
  - Examples: "Room created", "User joined room", "Password incorrect", "Name changed"
  - Displayed in both message list and terminal
  - Typically styled differently (info/warning/error colors)

### **Room Features**

- **Room Creation**: Name + optional password
- **Room Joining**: By ID + password verification
- **Message Persistence**: Messages saved per room with all types
- **Room List**: View all created rooms on homepage
- **Recent Rooms**: Track recently visited rooms
- **Single Terminal Focus**: One primary terminal per page; users switch rooms via commands or cards instead of multiple floating panels.
- **Activity Indicators**: Room info card shows owner, creation time, last activity, and whether a password exists.
- **Ownership Controls**:
  - Only the authenticated creator can delete (or restore) the room.
  - Ownership is displayed on RoomInfoCard and GuidePage.
  - Guests attempting owner-only commands receive actionable errors with guidance to register.
- **Room Persistence & Limits**:
  - Rooms persist in localStorage until deleted by owner or auto-archived after 14 days of inactivity.
  - Hard cap of 25 rooms per installation to prevent unbounded storage.
  - Archived rooms remain visible in history but cannot be joined unless reactivated by owner.

---

## Course Requirements Alignment

- **Initial Publish (Nov 5)**: Deployed to GitHub Pages, React Bootstrap integrated, StrictMode removed, HashRouter configured.
- **Check-In (Nov 19)**:
  - Live on GitHub.io with commit history
  - Primary navigation bar implemented
  - **At least 3 pages** partially developed via React Router (`/`, `/room/:roomId`, `/guides`), plus `/auth` scaffolded
  - **At least 5 reusable components** in use (Navbar, Terminal, CommandInput, TerminalOutput, MessageList, etc.)
  - Visible use of React Bootstrap components
- **Final Deliverable (Dec 10)**:
  - 3+ fully developed pages (Home, Room, Guide) + Auth experience polished
  - 12+ meaningful components
  - Thoughtful visual design + accessibility (contrast, alt text, labeled inputs, keyboard support)
  - Interactive element: room creation/joining/messaging workflow
  - Recorded presentation (4–7 minutes) covering features + design decisions

This spec keeps the design ambitious enough to be portfolio-ready but scoped to meet every checkpoint listed in the CS571 syllabus.

---

## Implementation Plan

### **Phase 1: Foundation** (Initial Publish - Nov 5)

**Goal**: Basic structure and routing

- [ ] Set up file structure (components/, pages/, utils/, context/)
- [ ] Create App.jsx with HashRouter and routes
- [ ] Build Navbar component
- [ ] Create HomePage (basic layout)
- [ ] Create RoomPage (basic layout)
- [ ] Create GuidePage (basic layout with placeholder content)
- [ ] Create AuthPage with SignUp/Login tabs
- [ ] Set up AppContext for shared state
- [ ] Create storage.js utilities
- [ ] Deploy to GitHub Pages

**Deliverables**:
- ✅ Website deployed and functional
- ✅ Navigation bar present
- ✅ 3 pages scaffolded (HomePage, RoomPage, GuidePage)
- ✅ Basic routing works

### **Phase 2: Core Functionality** (Check-In - Nov 19)

**Goal**: Room creation, joining, and messaging

- [ ] Implement CreateRoomForm component
- [ ] Implement JoinRoomForm component
- [ ] Build Terminal component
- [ ] Build CommandInput component
- [ ] Build TerminalOutput component
- [ ] Implement command parser (commands.js)
- [ ] Implement `/create` command
- [ ] Implement `/join` command
- [ ] Implement `/msg` command
- [ ] Build MessageList component
- [ ] Build MessageItem component
- [ ] Implement room storage utilities
- [ ] Style with React Bootstrap
- [ ] Populate GuidePage with command glossary + onboarding content
- [ ] Hook AuthPage forms into storage/session management

**Deliverables**:
- ✅ At least 5 components defined
- ✅ Room creation works
- ✅ Room joining works
- ✅ Basic messaging works
- ✅ Terminal interface functional
- ✅ React Bootstrap styling applied
- ✅ Sign-up / login / guest flows connected to context

### **Phase 3: Enhancement & Polish** (Final - Dec 10)

**Goal**: Complete features, accessibility, polish

- [ ] Implement remaining commands (/users, /help, /guide, /history, /clear)
- [ ] Build RoomCard component
- [ ] Build RoomInfoCard component
- [ ] Build UserList and UserItem components
- [ ] Build HelpPanel component
- [ ] Build PasswordModal component
- [ ] Build AuthForm component (toggle login/sign-up)
- [ ] Harden auth flows (PIN hash, session persistence, logout everywhere)
- [ ] Add password protection
- [ ] Improve visual design (terminal aesthetic)
- [ ] Add accessibility features:
  - [ ] Alt text on images
  - [ ] Proper heading hierarchy
  - [ ] Form labels
  - [ ] Color contrast (WCAG AA)
  - [ ] Keyboard navigation
  - [ ] ARIA labels
- [ ] Final testing and bug fixes

- **Deliverables**:
- ✅ 12+ components defined and used
- ✅ Home, Room, Guide, and Auth experiences fully developed
- ✅ Interactive element (room creation, messaging)
- ✅ Thoughtful design principles applied
- ✅ Accessibility requirements met
- ✅ Polished, professional website

---

## Step-by-Step Build Plan & Progress Tracking

Follow these numbered steps sequentially. After completing a step, mark it done (in a TODO list, journal, or GitHub issue) so you always know where you left off.

0. **Environment Prep**
   - `npm install`, run `npm run dev`.
   - Remove StrictMode, ensure Bootstrap CSS import is present.

1. **Routing Skeleton**
   - Configure HashRouter routes for `/`, `/room/:roomId`, `/guides`, `/auth`.
   - Each page renders a heading + placeholder text.

2. **Context & Storage**
   - Implement `AuthContext` (session state, signup/login/logout).
   - Implement `AppContext` (current room id, command output array).
   - Create `storage.js` helpers for accounts, rooms, messages, sessions.

3. **Layout & Navbar**
   - Build Navbar with links to all pages and identity badge (`Guest-####` or username).
   - Wire logout button to AuthContext.

4. **Terminal Loop**
   - Build `Terminal`, `CommandInput`, `TerminalOutput`.
   - Implement `/help`, `/guide`, `/whoami`, `/clear`.

5. **Auth Experience**
   - Build `AuthForm` (login / sign-up toggle) that talks to `AuthContext`.
   - Ensure Navbar logout button clears session.
   - Keep `/setname` and `/whoami` commands for quick identity changes/inspections.

6. **Room Lifecycle**
   - Build `CreateRoomForm`, `JoinRoomForm`, `RoomCard`.
   - Implement `/create`, `/join`, `/leave`, `/rooms`, `/delete`.
   - Add `RoomInfoCard` showing owner info + delete button (owner only).

7. **Messaging**
   - Build `MessageList`, `MessageItem`, `UserList`.
   - Implement `/msg`, `/users`.
   - Load last 50 messages on room entry; add “Load 25 earlier messages” button and `/history [count]`.

8. **Guide & Help Content**
   - Flesh out `GuidePage` (onboarding steps, command glossary, accessibility checklist).
   - Connect `HelpPanel` to the same content.

9. **Styling & Accessibility**
   - Apply terminal theme (colors, fonts), ensure responsive layout.
   - Add form labels, ARIA attributes, keyboard focus states.

10. **Testing & Deployment**
    - Manual test script: signup, create room, join as guest in another tab, chat, delete room, reload.
    - `npm run build`, push to GitHub, verify GitHub Pages deployment.

Repeat the checklist review before each work session so progress stays clear and no functionality is left behind.

---

## Component Design Patterns

### **Best Practices**

#### **1. Component Structure**

```jsx
// Good: Clear, focused component
function MessageItem({ message }) {
  return (
    <div className={`message-item message-${message.type}`}>
      <span className="message-user">{message.user || "Anonymous"}</span>
      <span className="message-text">{message.text}</span>
      <span className="message-time">{formatTime(message.timestamp)}</span>
    </div>
  );
}

// Bad: Component doing too much
function RoomPage() {
  // Don't put all logic here - break into smaller components
}
```

#### **2. Props & State**

```jsx
// Good: Props for data, state for UI
function CommandInput({ onCommand, history }) {
  const [input, setInput] = useState('');
  // ...
}

// Bad: Storing everything in state
function CommandInput() {
  const [everything, setEverything] = useState({ /* too much */ });
}
```

#### **3. Event Handlers**

```jsx
// Good: Named handler functions
function CreateRoomForm({ onCreateRoom }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // validation
    onCreateRoom(roomData);
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### **4. Conditional Rendering**

```jsx
// Good: Clear conditional rendering
function RoomCard({ room }) {
  return (
    <Card>
      <Card.Title>{room.name}</Card.Title>
      {room.password && <Badge>Protected</Badge>}
      {room.messageCount > 0 && (
        <span>{room.messageCount} messages</span>
      )}
    </Card>
  );
}
```

#### **5. useEffect for Side Effects**

```jsx
// Good: useEffect for localStorage operations
function RoomPage({ roomId }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Load messages from localStorage
    const stored = loadMessages(roomId);
    setMessages(stored);
  }, [roomId]);
  
  // ...
}
```

#### **6. Custom Hooks for Reusability**

```jsx
// Good: Extract logic into custom hook
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}
```

---

## Utility Functions

### **storage.js** - localStorage Helpers

```javascript
// Account operations
export function createAccount({ username, displayName, pin }) { /* hash pin, persist */ }
export function getAccount(username) { /* ... */ }
export function authenticate(username, pin) { /* ... */ }
export function saveSession(session) { /* ... */ }
export function clearSession() { /* ... */ }
export function getSession() { /* ... */ }

// Room operations
export function saveRoom(room) { /* ... */ }
export function getRoom(roomId) { /* ... */ }
export function getAllRooms() { /* ... */ }
export function deleteRoom(roomId) { /* ... */ }

// Message operations
export function saveMessage(roomId, message) { /* ... */ }
export function getMessages(roomId) { /* ... */ }
export function clearMessages(roomId) { /* ... */ }

// User preferences
export function getUsername() { 
  // Returns username from localStorage, or "Anonymous" if not set
  // Returns: string
}
export function setUsername(username) { 
  // Sets username in localStorage, or removes it if username is empty/null
  // If removed, user will appear as "Anonymous"
}
```

### **commands.js** - Command Parser

```javascript
export function parseCommand(input) {
  // Parse "/command arg1 arg2" (simple syntax, no flags)
  // Returns: { command, args }
  // Example: "/create MyRoom secret123" → { command: "create", args: ["MyRoom", "secret123"] }
}

export function executeCommand(command, args, context) {
  // Execute command based on type
  // Returns: { success, message, action, messageType }
  // messageType: "message" | "command" | "system"
}
```

### **roomUtils.js** - Room Utilities

```javascript
export function generateRoomId() {
  // Generate unique 6-character alphanumeric room ID
  // Format: lowercase letters (a-z) + numbers (0-9)
  // Examples: "abc123", "x7k9m2", "z4f8q1"
  // Checks localStorage for uniqueness, regenerates if duplicate
  // Returns: string (6 characters)
}

export function validateRoomId(roomId) {
  // Validate room ID format
  // Must be exactly 6 characters, alphanumeric (lowercase)
  // Returns: boolean
}

export function formatTimestamp(date) {
  // Format date for display
  // Input: Date object or ISO string
  // Returns: formatted string (e.g., "10:30 AM", "Nov 1, 2025 10:30 AM")
}
```

---

## Visual Design

### **Terminal Aesthetic**

- **Background**: Dark (`#0d1117` or `#1a1a1a`)
- **Text**: Light gray (`#c9d1d9`)
- **Accent**: Blue (`#58a6ff`) or Green (`#3fb950`)
- **Font**: Monospace for terminal (`'Courier New', monospace`)
- **Prompt**: `$` or `termrooms@room:~$`

### **Bootstrap Integration**

- Use Bootstrap components (Card, Form, Button, Modal, etc.)
- Customize with CSS variables for terminal theme
- Maintain Bootstrap's responsive grid system
- Use Bootstrap utilities for spacing, colors

### **Color Scheme**

```css
:root {
  --terminal-bg: #0d1117;
  --terminal-text: #c9d1d9;
  --terminal-accent: #58a6ff;
  --terminal-success: #3fb950;
  --terminal-error: #f85149;
  --terminal-prompt: #58a6ff;
}
```

---

## Accessibility Checklist

- [ ] **Headings**: Proper hierarchy (h1 → h2 → h3)
- [ ] **Images**: All have descriptive alt text
- [ ] **Forms**: All inputs have associated labels
- [ ] **Color Contrast**: Meets WCAG AA standards (4.5:1 for text)
- [ ] **Keyboard Navigation**: All interactive elements keyboard accessible
- [ ] **Focus Indicators**: Visible focus states
- [ ] **ARIA Labels**: Used where semantic HTML isn't sufficient
- [ ] **Form Validation**: Clear error messages

---

## Testing Strategy

### **Manual Testing Checklist**

- [ ] Create room works
- [ ] Join room works
- [ ] Password protection works
- [ ] Messages save and display
- [ ] Commands execute correctly
- [ ] Navigation works
- [ ] localStorage persists data
- [ ] Page refresh maintains state
- [ ] Invalid commands show errors
- [ ] Forms validate input

---

## Success Metrics

### **Minimum Requirements Met**

- ✅ Deployed on GitHub.io
- ✅ React Bootstrap used consistently
- ✅ Navigation bar present and functional
- ✅ 4 core experiences implemented (Home, Room, Guide, Auth)
- ✅ 12+ components defined and used
- ✅ Interactive element (room creation, messaging)
- ✅ Authenticated + guest flows operational
- ✅ Design principles applied
- ✅ Accessibility requirements met

---

## Next Steps

1. **Set up file structure** - Create folders (components/, pages/, utils/, context/)
2. **Create utility functions** - Build storage.js, commands.js, roomUtils.js
3. **Set up routing** - Configure App.jsx with HashRouter
4. **Build Navbar** - First component
5. **Build HomePage** - Create/join forms
6. **Build RoomPage** - Terminal interface
7. **Implement commands** - One at a time
8. **Add styling** - Terminal theme with Bootstrap
9. **Test & polish** - Accessibility, edge cases
10. **Deploy** - Build and push to GitHub

---

## Resources

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [React Bootstrap Documentation](https://react-bootstrap.github.io/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/)
- [MDN localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Status**: Ready for Implementation
**Last Updated**: Planning Phase
