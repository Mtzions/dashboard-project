import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AgentMarkdown = ({ text }) => {
  // Ensure we have valid content
  const content = typeof text === 'string' ? text : '';
  
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="agent-markdown"
    >
      {content}
    </ReactMarkdown>
  );
};

export default AgentMarkdown;