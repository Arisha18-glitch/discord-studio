import React from 'react';
import { DiscordEmbed } from '../../types/discord';
import { MarkdownRenderer } from './MarkdownRenderer';

interface EmbedPreviewProps {
  embed: DiscordEmbed;
}

export const EmbedPreview: React.FC<EmbedPreviewProps> = ({ embed }) => {
  const formatColor = (colorHex?: number): string => {
    if (colorHex === undefined || colorHex === null) return '#202225';
    return `#${colorHex.toString(16).padStart(6, '0')}`;
  };

  const hasAuthor = !!embed.author?.name?.trim();
  const hasTitle = !!embed.title?.trim();
  const hasDescription = !!embed.description?.trim();
  const hasFields = embed.fields && embed.fields.length > 0;
  const hasThumbnail = !!embed.thumbnail?.url?.trim();
  const hasImage = !!embed.image?.url?.trim();
  const hasFooter = !!embed.footer?.text?.trim() || !!embed.timestamp;

  // Don't render empty embed shells
  if (!hasAuthor && !hasTitle && !hasDescription && !hasFields && !hasThumbnail && !hasImage && !hasFooter) {
    return null;
  }

  return (
    <div
      className="mt-2 max-w-[520px] bg-discord-card rounded-[4px] border-l-4 p-4 flex flex-col gap-2 relative shadow-sm text-discord-text text-[13px]"
      style={{ borderLeftColor: formatColor(embed.color) }}
    >
      {/* Thumbnail (Top-Right Floating) */}
      {hasThumbnail && (
        <div className="absolute top-4 right-4 max-w-[80px] max-h-[80px] rounded overflow-hidden flex-shrink-0">
          <img
            src={embed.thumbnail?.url}
            alt=""
            className="w-full h-full object-cover rounded"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}

      <div className={hasThumbnail ? 'pr-[90px]' : ''}>
        {/* Author Section */}
        {hasAuthor && (
          <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
            {embed.author?.icon_url && (
              <img
                src={embed.author.icon_url}
                alt=""
                className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}
            {embed.author?.url ? (
              <a
                href={embed.author.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-white truncate"
              >
                {embed.author.name}
              </a>
            ) : (
              <span className="truncate">{embed.author?.name}</span>
            )}
          </div>
        )}

        {/* Title */}
        {hasTitle && (
          <div className="text-[15px] font-bold text-white mb-1 leading-snug">
            {embed.url ? (
              <a
                href={embed.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-discord-link hover:underline"
              >
                {embed.title}
              </a>
            ) : (
              <span>{embed.title}</span>
            )}
          </div>
        )}

        {/* Description */}
        {hasDescription && (
          <MarkdownRenderer
            content={embed.description}
            className="text-[13.5px] text-[#dbdee1] mb-2 leading-relaxed"
          />
        )}

        {/* Fields Grid */}
        {hasFields && (
          <div className="grid grid-cols-12 gap-2 my-2">
            {embed.fields.map((field) => {
              if (!field.name.trim() && !field.value.trim()) return null;
              return (
                <div
                  key={field.id}
                  className={field.inline ? 'col-span-12 sm:col-span-4' : 'col-span-12'}
                >
                  <div className="text-xs font-bold text-white mb-0.5 leading-tight">
                    <MarkdownRenderer content={field.name} />
                  </div>
                  <div className="text-[13px] text-[#dbdee1] leading-normal">
                    <MarkdownRenderer content={field.value} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Large Image */}
      {hasImage && (
        <div className="mt-1 rounded overflow-hidden max-h-[300px] w-full">
          <img
            src={embed.image?.url}
            alt=""
            className="rounded max-h-[300px] w-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Footer & Timestamp */}
      {hasFooter && (
        <div className="flex items-center gap-2 text-[11.5px] text-discord-muted mt-1 pt-1 border-t border-white/5">
          {embed.footer?.icon_url && (
            <img
              src={embed.footer.icon_url}
              alt=""
              className="w-4 h-4 rounded-full object-cover flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          )}
          <span className="truncate">
            {embed.footer?.text}
            {embed.footer?.text && embed.timestamp && ' • '}
            {embed.timestamp && new Date(embed.timestamp).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
      )}
    </div>
  );
};
