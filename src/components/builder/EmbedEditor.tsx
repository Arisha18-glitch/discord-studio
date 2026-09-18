import React, { useState } from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { ColorPicker } from '../shared/ColorPicker';
import { FieldEditor } from './FieldEditor';
import {
  Layers,
  Plus,
  Trash2,
  ChevronDown,
  Palette,
  User,
  Heading,
  AlignLeft,
  Image as ImageIcon,
  Clock,
  ExternalLink,
  Info
} from 'lucide-react';

export const EmbedEditor: React.FC = () => {
  const {
    payload,
    activeEmbedIndex,
    setActiveEmbedIndex,
    addEmbed,
    removeEmbed,
    updateEmbed,
    addEmbedField
  } = useBuilderStore();

  const [authorOpen, setAuthorOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [footerOpen, setFooterOpen] = useState(false);

  const currentEmbed = payload.embeds[activeEmbedIndex];

  if (!currentEmbed) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-discord-card rounded-lg border border-discord-border text-center">
        <Layers className="w-10 h-10 text-discord-muted mb-2" />
        <h3 className="text-white font-bold text-sm">No Embeds Configured</h3>
        <p className="text-xs text-discord-muted mt-1 mb-4">
          Add an embed to start designing your rich message card.
        </p>
        <button
          type="button"
          onClick={addEmbed}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-discord-blurple hover:bg-discord-blurple-hover text-white text-xs font-semibold shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Embed</span>
        </button>
      </div>
    );
  }

  const descLength = currentEmbed.description ? currentEmbed.description.length : 0;
  const titleLength = currentEmbed.title ? currentEmbed.title.length : 0;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Embeds Navigation / Tab Switcher (1 to 10 Embeds) */}
      <div className="flex items-center justify-between border-b border-discord-border pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {payload.embeds.map((emb, idx) => (
            <button
              key={emb.id}
              type="button"
              onClick={() => setActiveEmbedIndex(idx)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                activeEmbedIndex === idx
                  ? 'bg-discord-blurple text-white shadow-sm'
                  : 'bg-discord-input text-discord-muted hover:text-discord-text hover:bg-white/5'
              }`}
            >
              Embed #{idx + 1}
            </button>
          ))}

          {payload.embeds.length < 10 && (
            <button
              type="button"
              onClick={addEmbed}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium text-discord-muted hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              title="Add another embed (max 10)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>

        {payload.embeds.length > 1 && (
          <button
            type="button"
            onClick={() => removeEmbed(activeEmbedIndex)}
            className="inline-flex items-center gap-1.5 text-xs text-discord-red hover:text-red-400 bg-discord-red/10 px-2.5 py-1.5 rounded transition-colors"
            title="Delete this embed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Embed #{activeEmbedIndex + 1}</span>
          </button>
        )}
      </div>

      {/* 1. EMBED COLOR */}
      <div className="bg-discord-card border border-discord-border rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider">
          <Palette className="w-4 h-4 text-discord-blurple" />
          <span>Embed Accent Color</span>
        </div>
        <ColorPicker
          color={currentEmbed.color}
          onChange={(color) => updateEmbed(activeEmbedIndex, { color })}
        />
      </div>

      {/* 2. TITLE & DESCRIPTION */}
      <div className="bg-discord-card border border-discord-border rounded-lg p-4 flex flex-col gap-4">
        {/* Title & URL */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[11.5px] font-bold uppercase tracking-wider text-discord-muted flex items-center gap-1.5">
              <Heading className="w-3.5 h-3.5" />
              <span>Embed Title</span>
            </label>
            <span className={`text-[10.5px] font-mono ${titleLength > 256 ? 'text-discord-red font-bold' : 'text-discord-muted'}`}>
              {titleLength} / 256
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              maxLength={256}
              value={currentEmbed.title || ''}
              onChange={(e) => updateEmbed(activeEmbedIndex, { title: e.target.value })}
              placeholder="e.g. Server Announcements, VIP Tiers"
              className="bg-discord-input border border-discord-border rounded px-3 py-2 text-sm text-discord-text input-glow transition-all"
            />
            <div className="flex items-center bg-discord-input border border-discord-border rounded px-3 py-2 focus-within:border-discord-blurple">
              <ExternalLink className="w-3.5 h-3.5 text-discord-muted mr-2 flex-shrink-0" />
              <input
                type="url"
                value={currentEmbed.url || ''}
                onChange={(e) => updateEmbed(activeEmbedIndex, { url: e.target.value })}
                placeholder="Title Link URL (https://...)"
                className="bg-transparent text-xs text-discord-text placeholder-discord-muted outline-none w-full"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[11.5px] font-bold uppercase tracking-wider text-discord-muted flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Description (Markdown Supported)</span>
            </label>
            <span className={`text-[10.5px] font-mono ${descLength > 4096 ? 'text-discord-red font-bold' : 'text-discord-muted'}`}>
              {descLength} / 4096
            </span>
          </div>
          <textarea
            rows={5}
            maxLength={4096}
            value={currentEmbed.description || ''}
            onChange={(e) => updateEmbed(activeEmbedIndex, { description: e.target.value })}
            placeholder="Embed description text... Supports **bold**, *italic*, ~~strikethrough~~, ||spoiler||, > quotes, and links."
            className="w-full bg-discord-input border border-discord-border rounded p-3 text-sm text-discord-text input-glow transition-all leading-relaxed resize-y font-sans"
          />
        </div>
      </div>

      {/* 3. AUTHOR SECTION (Collapsible) */}
      <div className="bg-discord-card border border-discord-border rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setAuthorOpen((prev) => !prev)}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-white hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-discord-blurple" />
            <span>Author Header (Optional)</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-discord-muted transition-transform ${authorOpen ? 'rotate-180' : ''}`} />
        </button>

        {authorOpen && (
          <div className="p-4 border-t border-discord-border flex flex-col gap-3 bg-discord-darkest/30">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-discord-muted">Author Name</label>
              <input
                type="text"
                maxLength={256}
                value={currentEmbed.author?.name || ''}
                onChange={(e) =>
                  updateEmbed(activeEmbedIndex, {
                    author: { ...currentEmbed.author, name: e.target.value }
                  })
                }
                placeholder="e.g. Captain Webhook"
                className="bg-discord-input border border-discord-border rounded px-3 py-1.5 text-xs sm:text-sm text-discord-text input-glow transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-discord-muted">Author Icon URL</label>
                <input
                  type="url"
                  value={currentEmbed.author?.icon_url || ''}
                  onChange={(e) =>
                    updateEmbed(activeEmbedIndex, {
                      author: {
                        name: currentEmbed.author?.name || '',
                        ...currentEmbed.author,
                        icon_url: e.target.value
                      }
                    })
                  }
                  placeholder="https://i.imgur.com/author.png"
                  className="bg-discord-input border border-discord-border rounded px-3 py-1.5 text-xs text-discord-text input-glow transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-discord-muted">Author Link URL</label>
                <input
                  type="url"
                  value={currentEmbed.author?.url || ''}
                  onChange={(e) =>
                    updateEmbed(activeEmbedIndex, {
                      author: {
                        name: currentEmbed.author?.name || '',
                        ...currentEmbed.author,
                        url: e.target.value
                      }
                    })
                  }
                  placeholder="https://yourwebsite.com"
                  className="bg-discord-input border border-discord-border rounded px-3 py-1.5 text-xs text-discord-text input-glow transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. FIELDS SECTION */}
      <div className="bg-discord-card border border-discord-border rounded-lg p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white">Embed Fields</span>
            <span className="text-xs font-mono text-discord-muted">
              ({currentEmbed.fields.length} / 25)
            </span>
          </div>

          {currentEmbed.fields.length < 25 && (
            <button
              type="button"
              onClick={() => addEmbedField(activeEmbedIndex)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-discord-blurple hover:bg-discord-blurple-hover text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Field</span>
            </button>
          )}
        </div>

        {currentEmbed.fields.length === 0 ? (
          <p className="text-xs text-discord-muted italic">
            No fields added yet. Click &quot;Add Field&quot; to create columns of structured information.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {currentEmbed.fields.map((field, fIdx) => (
              <FieldEditor
                key={field.id}
                embedIndex={activeEmbedIndex}
                fieldIndex={fIdx}
                field={field}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. MEDIA & IMAGES (Collapsible) */}
      <div className="bg-discord-card border border-discord-border rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setMediaOpen((prev) => !prev)}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-white hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-discord-blurple" />
            <span>Images & Thumbnail (Optional)</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-discord-muted transition-transform ${mediaOpen ? 'rotate-180' : ''}`} />
        </button>

        {mediaOpen && (
          <div className="p-4 border-t border-discord-border flex flex-col gap-4 bg-discord-darkest/30">
            {/* Direct Image Link Tip */}
            <div className="flex items-start gap-2 text-xs bg-discord-blurple/10 border border-discord-blurple/30 p-2.5 rounded text-discord-text">
              <Info className="w-4 h-4 text-discord-blurple flex-shrink-0 mt-0.5" />
              <span>
                <strong>Tip:</strong> Use direct permanent image links (Imgur, PostImages, or your own CDN). Direct Discord attachment links expire after 24 hours.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-discord-muted">Thumbnail URL (Top-Right)</label>
                <input
                  type="url"
                  value={currentEmbed.thumbnail?.url || ''}
                  onChange={(e) =>
                    updateEmbed(activeEmbedIndex, {
                      thumbnail: e.target.value ? { url: e.target.value } : undefined
                    })
                  }
                  placeholder="https://i.imgur.com/thumb.png"
                  className="bg-discord-input border border-discord-border rounded px-3 py-1.5 text-xs text-discord-text input-glow transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-discord-muted">Large Image URL (Bottom Banner)</label>
                <input
                  type="url"
                  value={currentEmbed.image?.url || ''}
                  onChange={(e) =>
                    updateEmbed(activeEmbedIndex, {
                      image: e.target.value ? { url: e.target.value } : undefined
                    })
                  }
                  placeholder="https://i.imgur.com/banner.png"
                  className="bg-discord-input border border-discord-border rounded px-3 py-1.5 text-xs text-discord-text input-glow transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. FOOTER & TIMESTAMP (Collapsible) */}
      <div className="bg-discord-card border border-discord-border rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setFooterOpen((prev) => !prev)}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-white hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-discord-blurple" />
            <span>Footer & Timestamp (Optional)</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-discord-muted transition-transform ${footerOpen ? 'rotate-180' : ''}`} />
        </button>

        {footerOpen && (
          <div className="p-4 border-t border-discord-border flex flex-col gap-3 bg-discord-darkest/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-discord-muted">Footer Text</label>
                <input
                  type="text"
                  maxLength={2048}
                  value={currentEmbed.footer?.text || ''}
                  onChange={(e) =>
                    updateEmbed(activeEmbedIndex, {
                      footer: {
                        icon_url: currentEmbed.footer?.icon_url,
                        text: e.target.value
                      }
                    })
                  }
                  placeholder="e.g. Server Administration • All rights reserved"
                  className="bg-discord-input border border-discord-border rounded px-3 py-1.5 text-xs sm:text-sm text-discord-text input-glow transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-discord-muted">Footer Icon URL</label>
                <input
                  type="url"
                  value={currentEmbed.footer?.icon_url || ''}
                  onChange={(e) =>
                    updateEmbed(activeEmbedIndex, {
                      footer: {
                        text: currentEmbed.footer?.text || '',
                        icon_url: e.target.value
                      }
                    })
                  }
                  placeholder="https://i.imgur.com/footer-icon.png"
                  className="bg-discord-input border border-discord-border rounded px-3 py-1.5 text-xs text-discord-text input-glow transition-all"
                />
              </div>
            </div>

            {/* Timestamp Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-discord-text hover:text-white">
                <input
                  type="checkbox"
                  checked={!!currentEmbed.timestamp}
                  onChange={(e) =>
                    updateEmbed(activeEmbedIndex, {
                      timestamp: e.target.checked ? new Date().toISOString() : undefined
                    })
                  }
                  className="w-4 h-4 rounded bg-discord-input border-discord-border text-discord-blurple focus:ring-0 cursor-pointer"
                />
                <span className="font-medium">Include Real-Time Timestamp</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
