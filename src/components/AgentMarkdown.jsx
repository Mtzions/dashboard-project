import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AgentMarkdown = ({ text, children, className = "" }) => {
  const raw = text ?? children ?? "";
  // Guarantee a string to ReactMarkdown - this is the key safety measure
  const content =
    typeof raw === "string" ? raw : JSON.stringify(raw, null, 2);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={`agent-markdown ${className}`}
      components={{
        h1: ({ node, ...props }) => (
          <h2 className="am-h1" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h3 className="am-h2" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h4 className="am-h3" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="am-p" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="am-ul" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="am-ol" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="am-li" {...props} />
        ),
        hr: ({ node, ...props }) => (
          <div className="am-hr" />
        ),
        code({ node, inline, className, children, ...props }) {
          if (inline) {
            return (
              <code
                className={`am-code-inline ${className || ""}`}
                {...props}
              >
                {children}
              </code>
            );
          }

          return (
            <pre className="am-code-block">
              <code
                className={`am-code-block-inner ${className || ""}`}
                {...props}
              >
                {children}
              </code>
            </pre>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default AgentMarkdown;