import React from "react";

export function DebugTaskQueue({ tasks }) {
  return (
    <div
      style={{
        marginTop: 16,
        padding: 12,
        border: "2px dashed magenta",
        background: "rgba(0, 0, 0, 0.6)",
        color: "#ffffff",
        fontSize: 12,
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: "bold" }}>
        DEBUG TASK QUEUE (inline styles)
      </div>
      <div>
        <div style={{ marginBottom: 4 }}>
          tasks.length = {tasks ? tasks.length : 0}
        </div>
        {(!tasks || tasks.length === 0) && (
          <div style={{ color: "red" }}>No tasks passed in</div>
        )}
        {tasks &&
          tasks.map((task) => (
            <div
              key={task.id}
              style={{
                marginBottom: 8,
                padding: 8,
                borderRadius: 6,
                border: "1px solid #4ade80",
                background: "rgba(30, 64, 175, 0.4)",
              }}
            >
              <div style={{ fontWeight: 600 }}>{task.title}</div>
              <div>Status: {task.status}</div>
              {task.description && (
                <div style={{ opacity: 0.8 }}>{task.description}</div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default DebugTaskQueue;