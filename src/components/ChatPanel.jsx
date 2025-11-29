import React, { useState, useRef, useEffect } from 'react';
import './ChatPanel.css';

// Define quick replies as a constant outside component to prevent recreation
const QUICK_REPLIES = [
  "Summarize current tasks",
  "What's the status?",
  "Help me plan",
  "Show recent changes"
];

const ChatPanel = ({ projectId, modelPreset }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isThinking, setIsThinking] = useState(false);
  const [streamingText, setStreamingText] = useState('');
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
    if (!message.trim()) return;

    const trimmed = message.trim();

    // 1) Append user message to UI
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: trimmed,
      timestamp: "Just now",
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setMessage("");
    setIsThinking(true);

    // 2) Build OpenAI-style messages for backend
    const openAiMessages = newMessages.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    try {
      console.log("[ChatPanel] Sending to /api/chat", {
        projectId: projectId || null,
        mode: modelPreset.mode,
        usePremium: modelPreset.usePremium,
        messages: openAiMessages,
      });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: projectId || null,
          mode: modelPreset.mode,
          usePremium: modelPreset.usePremium,
          messages: openAiMessages,
        }),
      });

      console.log("[ChatPanel] /api/chat response status:", res.status, res.statusText);

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        console.error("[ChatPanel] /api/chat non-OK response body:", text);
        setIsThinking(false);
        // Add more robust error handling
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "agent",
            text: "Sorry, I encountered an error processing your request. Please try again.",
            timestamp: "Just now",
          },
        ]);
        return;
      }

      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error("[ChatPanel] Failed to parse JSON from /api/chat:", parseErr);
        setIsThinking(false);
        // Add error message to chat
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "agent",
            text: "Sorry, I encountered an error processing your request. Please try again.",
            timestamp: "Just now",
          },
        ]);
        return;
      }

      console.log("[ChatPanel] /api/chat JSON:", data);

      if (data && data.reply && data.reply.content) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "agent",
            text: data.reply.content,
            timestamp: "Just now",
          },
        ]);
      } else {
        console.warn("[ChatPanel] No reply.content in /api/chat payload:", data);
        // Add fallback message when no content is returned
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "agent",
            text: "I received a response but couldn't process it properly. Please try rephrasing your request.",
            timestamp: "Just now",
          },
        ]);
      }
    } catch (err) {
      console.error("[ChatPanel] Error calling /api/chat:", err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleChipClick = (text) => {
    setMessage(text);
    inputRef.current?.focus();
  };

  return (
    <div className="chat-panel" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="messages-container">
        {messages.map((msg, index) => {
          const isUser = msg.sender === "user";

          if (isUser) {
            // USER MESSAGE → keep bubble
            return (
              <div
                key={msg.id}
                className={`message-bubble user fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="message-content">
                  <div className="message-text">{msg.text}</div>
                  <div className="message-timestamp">{msg.timestamp}</div>
                </div>
              </div>
            );
          }

          // AGENT MESSAGE → plain text, NO bubble
          return (
            <div
              key={msg.id}
              className="agent-message-block fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="agent-markdown">
                {msg.text}
              </div>
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