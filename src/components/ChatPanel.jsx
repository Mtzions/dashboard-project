import React, { useState, useRef, useEffect } from 'react';
import ModelSelector, { MODEL_PRESETS } from "./ModelSelector";
import './ChatPanel.css';

// Define quick replies as a constant outside component to prevent recreation
const QUICK_REPLIES = [
  "Summarize current tasks",
  "What's the status?",
  "Help me plan",
  "Show recent changes"
];

const ChatPanel = ({ projectId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: "Sure, I'm ready to help out. What do you need assistance with?",
      timestamp: 'Just now'
    },
    {
      id: 2,
      sender: 'user',
      text: "I'm prepared to begin our tasks.",
      timestamp: 'Just now'
    }
  ]);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isThinking, setIsThinking] = useState(false);
  const [modelPreset, setModelPreset] = useState(MODEL_PRESETS[0]); // Default to gpt-5-mini
  
  // Use the constant instead of useState for quick replies
  const quickReplies = QUICK_REPLIES;

  // Only scroll when messages actually change, not on initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);

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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      const trimmed = message.trim();
      
      // 1) append user message locally
      const newMessages = [
        ...messages,
        {
          id: messages.length + 1,
          sender: 'user',
          text: trimmed,
          timestamp: 'Just now'
        }
      ];
      setMessages(newMessages);
      setMessage('');
      setIsThinking(true);

      try {
        // 2) call backend - Updated to use environment variable for backend URL
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
        const res = await fetch(`${backendUrl}/api/chat`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            // Add any required authentication headers here
            // "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            projectId: projectId || null,
            mode: modelPreset.mode,           // "chat" or "plan"
            usePremium: modelPreset.usePremium,
            messages: newMessages,
          }),
        });

        const data = await res.json();

        if (data && data.reply && data.reply.text) {
          // 3) append assistant reply
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              sender: data.reply.role || "agent",
              text: data.reply.text,
              timestamp: 'Just now'
            }
          ]);
        } else {
          // Optional: push an error-style bubble in chat
          console.warn("No reply content from /api/chat", data);
        }
      } catch (err) {
        console.error("Error calling /api/chat:", err);
        // Optional: show an error bubble in the chat UI
        // For now, we'll just log the error
      } finally {
        setIsThinking(false);
      }
    }
  };

  const handleChipClick = (text) => {
    setMessage(text);
    inputRef.current?.focus();
  };

  return (
    <div className="chat-panel">
      {/* HEADER ROW: title + model selector */}
      <div className="chat-panel-header">
        <div className="chat-panel-title">
          Chat Agent Chat
        </div>
        <ModelSelector
          selectedId={modelPreset.id}
          onChange={setModelPreset}
        />
      </div>
      
      <div className="messages-container" style={{ maxHeight: 'calc(100% - 100px)', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div 
            key={msg.id} 
            className={`message-bubble ${msg.sender} fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="message-content">
              <div className="message-text">{msg.text}</div>
              <div className="message-timestamp">{msg.timestamp}</div>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="message-bubble agent">
            <div className="message-content">
              <div className="message-text">
                Planner is thinking…
              </div>
              <div className="typing-indicator">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Quick Reply Chips */}
      <div className="quick-reply-chips">
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
      
      <form className="message-input-form" onSubmit={handleSendMessage}>
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
        />
        <button type="submit" className="send-button" disabled={isThinking}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;