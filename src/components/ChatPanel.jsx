import React, { useState, useRef, useEffect } from 'react';
import './ChatPanel.css';

// Define quick replies as a constant outside component to prevent recreation
const QUICK_REPLIES = [
  "Summarize current tasks",
  "What's the status?",
  "Help me plan",
  "Show recent changes"
];

const ChatPanel = () => {
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
  const [isTyping, setIsTyping] = useState(false);
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
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        text: message,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Convert UI messages to OpenAI format
      const openAiMessages = messages.concat(newMessage).map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));
      
      // Call backend API
      setIsTyping(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: null, // or use actual project ID if available
            mode: "chat", // or use actual mode if available
            usePremium: false, // or use actual premium setting if available
            messages: openAiMessages
          })
        });
        
        if (!res.ok) {
          console.error("Backend error:", res.status);
          setIsTyping(false);
          return;
        }
        
        const data = await res.json();
        
        if (data && data.reply && data.reply.content) {
          // Convert backend reply to UI message format
          setMessages(prev => [
            ...prev,
            {
              id: prev.length + 1,
              sender: data.reply.role === "user" ? "user" : "agent",
              text: data.reply.content,
              timestamp: "Just now"
            }
          ]);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setIsTyping(false);
      } finally {
        setIsTyping(false);
      }
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

        {isTyping && (
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