import React, { useState } from 'react';

interface MarkdownRendererProps {
  content?: string;
  className?: string;
}

/**
 * Parses Discord-flavored Markdown into safe React elements:
 * - **bold**
 * - *italic*
 * - ~~strikethrough~~
 * - ||spoiler|| (interactive reveal)
 * - `inline code`
 * - > blockquote
 * - [masked links](url)
 * - @everyone / @here / <@id> mentions
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content = '', className = '' }) => {
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<number, boolean>>({});

  if (!content || content.trim().length === 0) {
    return null;
  }

  const toggleSpoiler = (index: number) => {
    setRevealedSpoilers((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Split lines to handle blockquotes & multiline spacing
  const lines = content.split('\n');

  return (
    <div className={`leading-relaxed break-words whitespace-pre-wrap ${className}`}>
      {lines.map((line, lineIdx) => {
        // Handle Blockquote (> quote)
        const isQuote = line.startsWith('> ');
        const processedLine = isQuote ? line.slice(2) : line;

        const renderedLine = parseInlineDiscordMarkdown(processedLine, lineIdx, revealedSpoilers, toggleSpoiler);

        if (isQuote) {
          return (
            <div key={lineIdx} className="discord-quote my-1 pl-3 border-l-4 border-[#4e5058] text-[#b5bac1]">
              {renderedLine}
            </div>
          );
        }

        return (
          <React.Fragment key={lineIdx}>
            {renderedLine}
            {lineIdx < lines.length - 1 && '\n'}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/**
 * Tokenizes and transforms inline Discord markdown syntax safely into React elements.
 */
function parseInlineDiscordMarkdown(
  text: string,
  lineKey: number,
  revealedSpoilers: Record<number, boolean>,
  toggleSpoiler: (index: number) => void
): React.ReactNode[] {
  // Regex pattern matching Discord formatting primitives
  // 1: Bold (**text**)
  // 2: Strikethrough (~~text~~)
  // 3: Spoiler (||text||)
  // 4: Inline code (`code`)
  // 5: Links ([label](url))
  // 6: Italic (*text* or _text_)
  // 7: Mentions (@everyone, @here)
  const regex = /(\*\*.*?\*\*|~~.*?~~|\|\|.*?\|\||`.*?`|\[.*?\]\(https?:\/\/.*?\)|\*.*?\*|_.*?_|@everyone|@here)/g;

  const parts = text.split(regex);

  return parts.map((part, index) => {
    const key = `${lineKey}-${index}`;

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={key} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Strikethrough: ~~text~~
    if (part.startsWith('~~') && part.endsWith('~~') && part.length >= 4) {
      return (
        <del key={key} className="line-through text-discord-muted">
          {part.slice(2, -2)}
        </del>
      );
    }

    // Spoiler: ||text||
    if (part.startsWith('||') && part.endsWith('||') && part.length >= 4) {
      const spoilerIdx = lineKey * 100 + index;
      const isRevealed = !!revealedSpoilers[spoilerIdx];
      return (
        <span
          key={key}
          onClick={() => toggleSpoiler(spoilerIdx)}
          className={`discord-spoiler select-none transition-colors ${
            isRevealed
              ? 'bg-[#2b2d31] text-discord-text rounded px-1 cursor-text select-auto'
              : 'bg-[#202225] text-transparent rounded px-1 cursor-pointer hover:bg-[#2e3035]'
          }`}
          title={isRevealed ? '' : 'Click to reveal spoiler'}
        >
          {part.slice(2, -2)}
        </span>
      );
    }

    // Inline Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={key} className="discord-code-inline font-mono text-[0.88em] bg-[#202225] text-[#e0e2e5] px-1.5 py-0.5 rounded">
          {part.slice(1, -1)}
        </code>
      );
    }

    // Masked Hyperlink: [label](url)
    const linkMatch = part.match(/^\[(.*?)\]\((https?:\/\/.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={key}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-discord-link hover:underline"
        >
          {linkMatch[1]}
        </a>
      );
    }

    // Italic: *text* or _text_
    if (
      (part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
      (part.startsWith('_') && part.endsWith('_') && part.length >= 2)
    ) {
      return (
        <em key={key} className="italic text-discord-text">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Mentions: @everyone or @here
    if (part === '@everyone' || part === '@here') {
      return (
        <span key={key} className="discord-mention bg-[#5865f2]/20 text-[#c9cdfb] font-medium px-1 py-0.5 rounded">
          {part}
        </span>
      );
    }

    return part;
  });
}
