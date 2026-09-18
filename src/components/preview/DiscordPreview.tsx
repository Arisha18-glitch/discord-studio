import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { EmbedPreview } from './EmbedPreview';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Hash, ExternalLink, RefreshCw } from 'lucide-react';
import { DiscordButtonComponent } from '../../types/discord';

export const DiscordPreview: React.FC = () => {
  const { payload } = useBuilderStore();

  const getButtonStyleClasses = (style: DiscordButtonComponent['style']): string => {
    switch (style) {
      case 1: // Primary (Blurple)
        return 'bg-discord-blurple hover:bg-discord-blurple-hover text-white';
      case 2: // Secondary (Grey)
        return 'bg-[#4e5058] hover:bg-[#6d6f78] text-white';
      case 3: // Success (Green)
        return 'bg-discord-green hover:bg-discord-green-hover text-[#111214] font-semibold';
      case 4: // Danger (Red)
        return 'bg-discord-red hover:bg-discord-red-hover text-white';
      case 5: // Link (Grey with External Icon)
        return 'bg-[#4e5058] hover:bg-[#6d6f78] text-white';
      default:
        return 'bg-discord-blurple text-white';
    }
  };

  const defaultAvatar = 'https://cdn.discordapp.com/embed/avatars/0.png';

  return (
    <div className="flex flex-col h-full bg-discord-chat overflow-hidden border-l border-discord-border">
      {/* Discord Channel Header */}
      <div className="h-12 border-b border-black/20 px-4 flex items-center justify-between flex-shrink-0 bg-discord-chat shadow-sm">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Hash className="w-5 h-5 text-discord-muted" />
          <span>announcements</span>
          <span className="text-xs text-discord-muted font-normal border-l border-discord-border pl-2 ml-1 hidden sm:inline">
            Server broadcast channel
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-[11px] bg-black/30 px-2.5 py-1 rounded-full text-discord-muted font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-discord-green animate-pulse" />
            Live Discord Preview
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="p-1.5 rounded hover:bg-white/10 text-discord-muted hover:text-white transition-colors"
            title="Refresh Preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Discord Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="flex items-start gap-4 hover:bg-black/[0.04] p-2 rounded transition-colors group">
          {/* Avatar */}
          <div className="flex-shrink-0 pt-0.5">
            <img
              src={payload.avatar_url || defaultAvatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover select-none"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultAvatar;
              }}
            />
          </div>

          {/* Message Content Body */}
          <div className="flex-1 min-w-0">
            {/* Header: Username, BOT Badge, Timestamp */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-semibold text-white text-[15px] hover:underline cursor-pointer">
                {payload.username || 'Discord Studio'}
              </span>
              <span className="bg-discord-blurple text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] uppercase tracking-wide inline-flex items-center gap-1">
                ✓ BOT
              </span>
              <span className="text-[11.5px] text-discord-muted">
                Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Plain Message Text Content */}
            {payload.content && (
              <MarkdownRenderer
                content={payload.content}
                className="text-[14.5px] text-discord-text mb-2 leading-relaxed"
              />
            )}

            {/* Embeds List */}
            {payload.embeds && payload.embeds.length > 0 && (
              <div className="flex flex-col gap-2">
                {payload.embeds.map((embed) => (
                  <EmbedPreview key={embed.id} embed={embed} />
                ))}
              </div>
            )}

            {/* Interactive Components (Button Rows) */}
            {payload.components && payload.components.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {payload.components.map((row) => (
                  <div key={row.id} className="flex flex-wrap gap-2">
                    {row.components.map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        disabled={btn.disabled}
                        onClick={() => {
                          if (btn.style === 5 && btn.url) {
                            window.open(btn.url, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[3px] text-[13.5px] font-medium transition-colors shadow-sm ${getButtonStyleClasses(
                          btn.style
                        )} ${btn.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {btn.emoji?.name && <span>{btn.emoji.name}</span>}
                        <span>{btn.label || 'Button'}</span>
                        {btn.style === 5 && <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
