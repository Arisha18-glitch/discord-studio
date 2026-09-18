import React, { useRef, useState } from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import {
  User,
  Image as ImageIcon,
  MessageSquare,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Eye,
  Quote,
  ChevronDown,
  Hash
} from 'lucide-react';

export const MessageEditor: React.FC = () => {
  const { payload, updateMessageContent, updateWebhookProfile, threadId, setThreadId } = useBuilderStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [threadOpen, setThreadOpen] = useState(false);

  // Inserts markdown syntax at the current cursor position or around selection
  const insertMarkdown = (syntax: string, isBlock = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);

    let replacement = '';
    if (isBlock) {
      replacement = `${syntax}${selection || 'quoted text'}\n`;
    } else if (syntax === '@everyone' || syntax === '@here') {
      replacement = `${syntax} `;
    } else {
      replacement = `${syntax}${selection || 'text'}${syntax}`;
    }

    const updatedText = text.substring(0, start) + replacement + text.substring(end);
    updateMessageContent(updatedText);

    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + syntax.length,
        start + syntax.length + (selection.length || (isBlock ? 11 : 4))
      );
    }, 0);
  };

  const contentLength = payload.content ? payload.content.length : 0;
  const isOverLimit = contentLength > 2000;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Section Header */}
      <div className="border-b border-discord-border pb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-discord-blurple" />
          <span>Message & Webhook Identity</span>
        </h2>
        <p className="text-xs text-discord-muted mt-1">
          Customize the message sender profile and plain text content displayed above your embeds.
        </p>
      </div>

      {/* Webhook Identity Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Username Override */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11.5px] font-bold uppercase tracking-wider text-discord-muted flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>Webhook Username</span>
          </label>
          <input
            type="text"
            value={payload.username || ''}
            onChange={(e) => updateWebhookProfile(e.target.value, payload.avatar_url)}
            placeholder="e.g. Server Announcements, Verifier"
            className="bg-discord-input border border-discord-border rounded px-3 py-2 text-sm text-discord-text input-glow transition-all"
          />
          <span className="text-[11px] text-discord-muted/70">
            Overrides the default webhook name in channel
          </span>
        </div>

        {/* Avatar Override */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11.5px] font-bold uppercase tracking-wider text-discord-muted flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Webhook Avatar URL</span>
          </label>
          <input
            type="url"
            value={payload.avatar_url || ''}
            onChange={(e) => updateWebhookProfile(payload.username, e.target.value)}
            placeholder="https://i.imgur.com/your-avatar.png"
            className="bg-discord-input border border-discord-border rounded px-3 py-2 text-sm text-discord-text input-glow transition-all"
          />
          <span className="text-[11px] text-discord-muted/70">
            Direct link to PNG, JPG, or GIF image
          </span>
        </div>
      </div>

      {/* Plain Text Message Content */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-[11.5px] font-bold uppercase tracking-wider text-discord-muted">
            Message Content (Text & Mentions)
          </label>

          {/* Quick Markdown Formatting Toolbar */}
          <div className="flex items-center gap-1 bg-discord-input p-1 rounded border border-discord-border">
            <button
              type="button"
              onClick={() => insertMarkdown('**')}
              className="p-1 rounded text-discord-muted hover:text-white hover:bg-white/10 transition-colors"
              title="Bold (**text**)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('*')}
              className="p-1 rounded text-discord-muted hover:text-white hover:bg-white/10 transition-colors"
              title="Italic (*text*)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('~~')}
              className="p-1 rounded text-discord-muted hover:text-white hover:bg-white/10 transition-colors"
              title="Strikethrough (~~text~~)"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('`')}
              className="p-1 rounded text-discord-muted hover:text-white hover:bg-white/10 transition-colors"
              title="Inline Code (`code`)"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('||')}
              className="p-1 rounded text-discord-muted hover:text-white hover:bg-white/10 transition-colors"
              title="Spoiler (||text||)"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('> ', true)}
              className="p-1 rounded text-discord-muted hover:text-white hover:bg-white/10 transition-colors"
              title="Blockquote (> text)"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('@everyone')}
              className="p-1 rounded text-discord-muted hover:text-white hover:bg-white/10 transition-colors text-xs font-semibold px-1.5"
              title="Mention @everyone"
            >
              @everyone
            </button>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={5}
          value={payload.content || ''}
          onChange={(e) => updateMessageContent(e.target.value)}
          placeholder="Type your message here... Use @everyone, @here, or markdown formatting."
          className="w-full bg-discord-input border border-discord-border rounded p-3 text-sm text-discord-text input-glow transition-all font-sans leading-relaxed resize-y"
        />

        {/* Character Counter */}
        <div className="flex justify-end">
          <span
            className={`text-xs font-mono ${
              isOverLimit
                ? 'text-discord-red font-bold'
                : contentLength > 1800
                ? 'text-discord-yellow'
                : 'text-discord-muted'
            }`}
          >
            {contentLength} / 2000
          </span>
        </div>
      </div>

      {/* Discohook-style Collapsible Thread Settings */}
      <div className="bg-discord-card border border-discord-border rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setThreadOpen((prev) => !prev)}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-white hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-discord-blurple" />
            <span>Target Thread or Forum (Optional)</span>
            {threadId.trim() && (
              <span className="text-[10px] bg-discord-green/20 text-discord-green px-1.5 py-0.2 rounded font-mono font-normal">
                Active
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-discord-muted transition-transform ${
              threadOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {threadOpen && (
          <div className="p-4 border-t border-discord-border flex flex-col gap-2 bg-discord-darkest/40">
            <label className="text-[11px] font-bold text-discord-muted uppercase tracking-wider">
              Discord Thread ID
            </label>
            <input
              type="text"
              value={threadId}
              onChange={(e) => setThreadId(e.target.value)}
              placeholder="e.g. 110293847561928374"
              className="bg-discord-input border border-discord-border rounded px-3 py-2 text-xs font-mono text-discord-text input-glow transition-all"
            />
            <span className="text-[11px] text-discord-muted">
              Right-click your Discord thread or forum post &rarr; Copy Thread ID. Messages will be sent directly inside the thread.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
