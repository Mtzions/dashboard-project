import React, { useState, useRef, useEffect } from 'react';
import './ChatPanel.css';
import AgentMarkdown from "./AgentMarkdown";
import { api } from "../utils/apiClient";
import { useProject } from "../context/ProjectStateContext";
import PlannerWithMCPButton from "./PlannerWithMCPButton";

// Define quick replies as a constant outside component to prevent recreation
const QUICK_REPLIES = [
  "Summarize current tasks",
  "What's the status?",
  "Help me plan",
  "Show recent changes"
];

const ChatPanel = ({ modelPreset }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isThinking, setIsThinking] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  // Use the constant instead of useState for quick replies
  const quickReplies = QUICK_REPLIES;

  // Load chat history when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        setLoading(true);
        const history = await api.getMessages("dashboard-project", "user_planner");
        // Convert backend format to frontend format
        const formattedMessages = history.map(msg => ({
          id: msg.id,
          sender: msg.role === "user" ? "user" : "agent",
          text: msg.content,
          timestamp: msg.timestamp || "Just now"
        }));
        setMessages(formattedMessages);
      } catch (err) {
        console.error("Failed to load chat history:", err);
        // Even if loading fails, we still want to show the chat interface
      } finally {
        setLoading(false);
      }
    };

    loadChatHistory();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages, streamingText]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // '/' key to focus chat input when not focused
      if (e.key === '/' && !e.target.classList.contains('message-input')) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const simulateTextStreaming = (text, callback) => {
    let index = 0;
    setStreamingText('');
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setStreamingText(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        callback();
      }
    }, 20); // Speed of typing effect
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const trimmed = message.trim();
    if (!trimmed) return;

    // 1) Build the new user message for local UI
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: trimmed,
      timestamp: "Just now",
    };

    const newMessages = [...messages, userMessage];

    // 2) Update UI immediately
    setMessages(newMessages);
    setMessage("");
    setIsThinking(true);

    try {
// 3) Map UI messages -> OpenAI chat format
      const apiMessages = newMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text ?? "",
      }));

      // Use the api client for consistent API calls
      const payload = {
        projectId: "dashboard-project", // Fixed project ID as per backend contract
        mode: modelPreset?.mode || "chat",      // "chat" or "plan"
        messages: apiMessages,
      };

      // Enhanced debugging for proxy verification
      console.log("[ChatPanel] DEBUG: About to send to /api/chat:", {
        ...payload,
        // Don't log the full messages array to avoid console spam
        messagesPreview: payload.messages.slice(-1).map(m => ({role: m.role, content: m.content.substring(0, 50) + '...'}))
      });

      // Use the api client instead of direct fetch for consistency
      const data = await api.chat(payload);

      console.log("[ChatPanel] DEBUG: /api/chat response received:", data);

      const content = data?.reply?.content;
      const role = data?.reply?.role || "assistant";

      if (typeof content === "string" && content.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: role === "user" ? "user" : "agent", // normalize assistant -> agent
            text: content,                              // markdown string
            timestamp: "Just now",
          },
        ]);
      } else {
        console.warn(
          "[ChatPanel] WARNING: No valid string reply.content in /api/chat response:",
          data
        );
      }
    } catch (err) {
      console.error("[ChatPanel] ERROR: Failed to call /api/chat:", err);
      // Show error in UI by adding an error message
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "agent",
          text: `Error: ${err.message || 'Failed to get response'}`,
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleChipClick = (text) => {
    setMessage(text);
    inputRef.current?.focus();
  };

  if (loading) {
    return (
      <div className="chat-panel" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading chat history...
      </div>
    );
  }

  return (
    <div className="chat-panel" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="messages-container">
        {messages.map((msg, index) => {
          const key = msg.id ?? index;
          const isUser = msg.sender === "user";

          if (isUser) {
            // USER MESSAGE → bubble on right
            return (
              <div
                key={key}
                className="message-bubble user fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="message-content">
                  <div className="message-text">
                    {String(msg.text ?? "")}
                  </div>
                  <div className="message-timestamp">{msg.timestamp}</div>
                </div>
              </div>
            );
          }

          // AGENT MESSAGE → formatted markdown block
          return (
            <div
              key={key}
              className="agent-message-block fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
              data-sender={msg.sender}
            >
              <AgentMarkdown text={msg.text} />
              <div className="message-timestamp agent-timestamp">
                {msg.timestamp}
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="agent-message-block fade-in thinking-block">
            <div className="typing-indicator">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      
      {/* Quick Reply Chips */}
      <div className="quick-reply-chips" style={{ width: '100%' }}>
        {quickReplies.map((reply, index) => (
          <button
            key={index}
            className="quick-reply-chip"
            onClick={() => handleChipClick(reply)}
          >
            {reply}
          </button>
        ))}
      </div>
      
      <form className="message-input-form" onSubmit={handleSendMessage} style={{ width: '100%' }}>
        <input
          ref={inputRef}
          type="text"
          className="message-input"
          placeholder="Type a message to the agent..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
          style={{ width: '100%' }}
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default ChatPanel;