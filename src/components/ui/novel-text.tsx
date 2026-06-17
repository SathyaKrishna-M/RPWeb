import React from "react";

export function NovelText({ content }: { content: string }) {
  if (!content) return null;

  const paragraphs = content.split(/\n+/);

  return (
    <div className="novel-text" style={{ 
      fontFamily: "'Georgia', 'Times New Roman', serif", 
      lineHeight: 1.8, 
      fontSize: "1.1rem",
      color: "var(--ink)"
    }}>
      {paragraphs.map((paragraph, index) => {
        // Simple regex to parse dialogue in quotes, and actions in asterisks
        // e.g., "Hello" -> dialogue
        // e.g., *He waved.* -> action
        
        let elements: React.ReactNode[] = [];
        let currentString = paragraph;
        let elementKey = 0;

        // Match quotes "" or asterisks **
        const regex = /(".*?"|\*.*?\*|_.*?_)/g;
        
        let lastIndex = 0;
        let match;
        
        while ((match = regex.exec(currentString)) !== null) {
          // Add preceding text
          if (match.index > lastIndex) {
            elements.push(<span key={elementKey++}>{currentString.slice(lastIndex, match.index)}</span>);
          }

          const matchedText = match[0];
          if (matchedText.startsWith('"') && matchedText.endsWith('"')) {
            // Dialogue
            elements.push(
              <span key={elementKey++} style={{ color: "var(--primary)", fontWeight: 500 }}>
                {matchedText}
              </span>
            );
          } else if ((matchedText.startsWith('*') && matchedText.endsWith('*')) || (matchedText.startsWith('_') && matchedText.endsWith('_'))) {
            // Action
            elements.push(
              <em key={elementKey++} style={{ color: "var(--muted)" }}>
                {matchedText.slice(1, -1)}
              </em>
            );
          }

          lastIndex = regex.lastIndex;
        }

        // Add remaining text
        if (lastIndex < currentString.length) {
          elements.push(<span key={elementKey++}>{currentString.slice(lastIndex)}</span>);
        }

        return (
          <p key={index} style={{ marginBottom: "1.2rem", textIndent: "1.5rem" }}>
            {elements.length > 0 ? elements : paragraph}
          </p>
        );
      })}
    </div>
  );
}
