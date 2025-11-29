import React from "react";

export function DebugChatPanel({ messages }) {
  return (
    <div
      style={{
        marginTop: 16,
        padding: 12,
        border: "2px dashed cyan",
        background: "rgba(15, 23, 42, 0.8)",
        color: "#ffffff",
        fontSize: 12,
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: "bold" }}>
        DEBUG CHAT PANEL (inline styles)
      </div>
      <div style={{ marginBottom: 4 }}>
        messages.length = {messages ? messages.length : 0}
      </div>
      {(!messages || messages.length === 0) && (
        <div style={{ color: "red" }}>No messages passed in</div>
      )}
      <div>
        {messages &&
          messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: 6,
                padding: 6,
                borderRadius: 6,
                background: m.role === "user"
                  ? "rgba(96, 165, 250, 0.5)"
                  : "rgba(74, 222, 128, 0.5)",
              }}
            >
              <div style={{ fontWeight: 600 }}>{m.role}</div>
              <div>{m.content}</div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default DebugChatPanel;