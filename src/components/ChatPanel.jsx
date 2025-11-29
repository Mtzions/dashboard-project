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

  const handleSendMessage = (e) => {
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
      
      // Simulate agent response after a delay
      setIsTyping(true);
      setTimeout(() => {
        const agentResponse = {
          id: messages.length + 2,
          sender: 'agent',
          text: "Thanks for your message. I'm processing your request now. This is a simulated streaming response that demonstrates how text would appear character by character in a real implementation.",
          timestamp: 'Just now'
        };
        
        // Start streaming the text
        simulateTextStreaming(agentResponse.text, () => {
          setMessages(prev => [...prev, agentResponse]);
          setIsTyping(false);
        });
      }, 1000);
    }
  };

  const handleChipClick = (text) => {
    setMessage(text);
    inputRef.current?.focus();
  };

  return (
    <div className="chat-panel">
      <div className="messages-container" style={{ maxHeight: 'calc(100% - 100px)', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div 
            key={msg.id} 
            className={`message-bubble ${msg.sender}`}
          >
            <div className="message-content">
              <div className="message-text">{msg.text}</div>
              <div className="message-timestamp">{msg.timestamp}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-bubble agent">
            <div className="message-content">
              <div className="message-text">
                <span className="typing-indicator">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </span>
              </div>
            </div>
          </div>
        )}
        {streamingText && (
          <div className="message-bubble agent">
            <div className="message-content">
              <div className="message-text">{streamingText}</div>
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
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default ChatPanel;