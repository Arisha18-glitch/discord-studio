import React, { useState } from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { useToast } from '../shared/Toast';
import { DiscordButtonStyle } from '../../types/discord';
import {
  Boxes,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  Info,
  Check
} from 'lucide-react';

export const ButtonEditor: React.FC = () => {
  const { payload, addButtonRow, removeButtonRow, addButton, updateButton, removeButton } =
    useBuilderStore();
  const toast = useToast();

  const [copiedCode, setCopiedCode] = useState(false);

  // Generate ready-to-paste Discord.js v14 Component code
  const generateDiscordJsCode = (): string => {
    return `// Discord.js v14 Component Code for Custom Bot
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const rows = [
${payload.components
  .map(
    (row) => `  new ActionRowBuilder().addComponents(
${row.components
  .map((btn) => {
    if (btn.style === 5) {
      return `    new ButtonBuilder()
      .setLabel('${btn.label || 'Link'}')
      .setStyle(ButtonStyle.Link)
      .setURL('${btn.url || 'https://discord.com'}')`;
    }
    const styleName =
      btn.style === 1
        ? 'Primary'
        : btn.style === 2
        ? 'Secondary'
        : btn.style === 3
        ? 'Success'
        : 'Danger';
    return `    new ButtonBuilder()
      .setCustomId('${btn.custom_id || btn.id}')
      .setLabel('${btn.label || 'Button'}')
      .setStyle(ButtonStyle.${styleName})`;
  })
  .join(',\n')}
  )`
  )
  .join(',\n')}
];

// Send via bot:
await channel.send({ content: '${payload.content || ''}', components: rows });`;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateDiscordJsCode());
      setCopiedCode(true);
      toast.success('Discord.js button code copied to clipboard!');
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      toast.error('Failed to copy code to clipboard.');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Header & Explanation Banner */}
      <div className="border-b border-discord-border pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Boxes className="w-4 h-4 text-discord-blurple" />
            <span>Interactive Action Buttons</span>
          </h2>

          {payload.components.length > 0 && (
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#4e5058] hover:bg-[#6d6f78] text-white transition-colors shadow-sm"
              title="Copy Discord.js code for custom bots"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-discord-green" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Discord.js Code'}</span>
            </button>
          )}
        </div>

        <p className="text-xs text-discord-muted mt-1">
          Design interactive button rows. Link buttons work immediately with Webhooks! Action buttons export code for Discord bots.
        </p>
      </div>

      {/* Pro Tip Info Alert */}
      <div className="bg-discord-blurple/10 border-l-4 border-discord-blurple p-3 rounded text-xs text-discord-text flex gap-3">
        <Info className="w-5 h-5 text-discord-blurple flex-shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <strong className="text-white">Understanding Discord Buttons:</strong>
          <p className="text-discord-muted">
            <strong>Link Buttons (Style 5)</strong> open external websites directly and work with standard Discord Webhooks. 
            <strong>Action Buttons (Primary, Success, Danger)</strong> can be previewed here and exported as ready-to-use Discord.js code for your custom bot backend.
          </p>
        </div>
      </div>

      {/* ActionRows List */}
      <div className="flex flex-col gap-4">
        {payload.components.length === 0 ? (
          <div className="bg-discord-card border border-discord-border rounded-lg p-6 text-center flex flex-col items-center">
            <Boxes className="w-8 h-8 text-discord-muted mb-2" />
            <h3 className="text-sm font-bold text-white">No Button Rows</h3>
            <p className="text-xs text-discord-muted mt-1 mb-4">
              Add a button row to attach interactive links or actions to your message.
            </p>
            <button
              type="button"
              onClick={addButtonRow}
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-discord-blurple hover:bg-discord-blurple-hover text-white text-xs font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Button Row</span>
            </button>
          </div>
        ) : (
          payload.components.map((row, rIdx) => (
            <div
              key={row.id}
              className="bg-discord-card border border-discord-border rounded-lg p-4 flex flex-col gap-4"
            >
              {/* Row Header */}
              <div className="flex items-center justify-between border-b border-discord-border pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Action Row #{rIdx + 1}
                  </span>
                  <span className="text-xs font-mono text-discord-muted">
                    ({row.components.length} / 5 buttons)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {row.components.length < 5 && (
                    <button
                      type="button"
                      onClick={() => addButton(rIdx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-discord-blurple hover:bg-discord-blurple-hover text-white transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Button</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeButtonRow(rIdx)}
                    className="text-discord-muted hover:text-discord-red p-1 rounded transition-colors"
                    title="Delete Row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Row's Buttons */}
              <div className="flex flex-col gap-3">
                {row.components.map((btn, bIdx) => (
                  <div
                    key={btn.id}
                    className="bg-discord-darkest/70 border border-discord-border rounded-md p-3 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Button #{bIdx + 1}</span>
                        {btn.style === 5 ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-discord-blurple/20 text-discord-link flex items-center gap-1">
                            <ExternalLink className="w-2.5 h-2.5" /> Webhook Link
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-discord-muted">
                            Bot Action
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeButton(rIdx, bIdx)}
                        className="text-discord-muted hover:text-discord-red p-1 rounded transition-colors"
                        title="Remove Button"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Style Selector */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-discord-muted">Style</label>
                        <select
                          value={btn.style}
                          onChange={(e) =>
                            updateButton(rIdx, bIdx, {
                              style: Number(e.target.value) as DiscordButtonStyle
                            })
                          }
                          className="bg-discord-input border border-discord-border rounded px-2.5 py-1.5 text-xs text-discord-text outline-none focus:border-discord-blurple cursor-pointer"
                        >
                          <option value={5}>Link (URL)</option>
                          <option value={1}>Primary (Blurple)</option>
                          <option value={2}>Secondary (Grey)</option>
                          <option value={3}>Success (Green)</option>
                          <option value={4}>Danger (Red)</option>
                        </select>
                      </div>

                      {/* Label Input */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-discord-muted">Label</label>
                        <input
                          type="text"
                          maxLength={80}
                          value={btn.label}
                          onChange={(e) => updateButton(rIdx, bIdx, { label: e.target.value })}
                          placeholder="e.g. Visit Website, Verify"
                          className="bg-discord-input border border-discord-border rounded px-2.5 py-1.5 text-xs text-discord-text input-glow transition-all"
                        />
                      </div>

                      {/* Emoji Input */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-discord-muted">Emoji (Optional)</label>
                        <input
                          type="text"
                          value={btn.emoji?.name || ''}
                          onChange={(e) =>
                            updateButton(rIdx, bIdx, {
                              emoji: e.target.value ? { name: e.target.value } : undefined
                            })
                          }
                          placeholder="e.g. 🔗, 🚀, 🎮"
                          className="bg-discord-input border border-discord-border rounded px-2.5 py-1.5 text-xs text-discord-text input-glow transition-all"
                        />
                      </div>
                    </div>

                    {/* Target URL (for style 5) or Custom ID (for styles 1-4) */}
                    {btn.style === 5 ? (
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-discord-muted">Target Web URL (https://...)</label>
                        <input
                          type="url"
                          value={btn.url || ''}
                          onChange={(e) => updateButton(rIdx, bIdx, { url: e.target.value })}
                          placeholder="https://yourwebsite.com"
                          className="bg-discord-input border border-discord-border rounded px-2.5 py-1.5 text-xs text-discord-text input-glow transition-all"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-discord-muted">Bot Custom ID (Interaction identifier)</label>
                        <input
                          type="text"
                          value={btn.custom_id || ''}
                          onChange={(e) => updateButton(rIdx, bIdx, { custom_id: e.target.value })}
                          placeholder="e.g. verify_member_btn, open_ticket_btn"
                          className="bg-discord-input border border-discord-border rounded px-2.5 py-1.5 text-xs font-mono text-discord-text input-glow transition-all"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {payload.components.length > 0 && payload.components.length < 5 && (
          <button
            type="button"
            onClick={addButtonRow}
            className="inline-flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-discord-border hover:border-discord-blurple text-discord-muted hover:text-white text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Another Action Row ({payload.components.length}/5)</span>
          </button>
        )}
      </div>
    </div>
  );
};
