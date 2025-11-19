export const COMMAND_SECTIONS = [
  {
    key: "global",
    title: "Global (any page)",
    scope: "Everyone",
    commands: [
      { syntax: "/help", description: "Show these role-scoped commands." },
      { syntax: "/guide", description: "Open the guide & onboarding page." },
      { syntax: "/whoami", description: "Show your identity and current room role." },
      { syntax: "/setname <display-name>", description: "Update the display name for this tab." },
      { syntax: "/clear", description: "Reset the terminal output buffer." },
      { syntax: "Plain text", description: "Send chat to everyone in the active room." },
    ],
  },
  {
    key: "members",
    title: "Room members",
    scope: "Inside a room (any role)",
    commands: [
      { syntax: "/leave", description: "Exit the room and return to the lobby." },
      { syntax: "/recent [clear]", description: "List or clear recently opened rooms." },
      {
        syntax: "/relay <room-id> [password] <text>",
        description: "Send a message into another room without leaving.",
      },
    ],
  },
  {
    key: "leads",
    title: "Lead commands",
    scope: "Leader or co-leader",
    commands: [
      { syntax: "/invite <username> [message]", description: "Send an invite to someone’s mailbox." },
      { syntax: "/kick <display-name>", description: "Remove a participant from the current room." },
    ],
  },
  {
    key: "leader",
    title: "Leader only",
    scope: "Room owner",
    commands: [
      { syntax: "/topic [text|clear]", description: "View, set, or clear the persistent room topic." },
      { syntax: "/delete <room-id>", description: "Delete a room you own (every tab is redirected)." },
      { syntax: "/ban <display-name>", description: "Ban + remove a participant from the room." },
      { syntax: "/promote <display-name>", description: "Promote a member to co-leader." },
      { syntax: "/demote <display-name>", description: "Demote a co-leader back to member." },
    ],
  },
];

