import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { DiscordEmbedField } from '../../types/discord';
import { Trash2 } from 'lucide-react';

interface FieldEditorProps {
  embedIndex: number;
  fieldIndex: number;
  field: DiscordEmbedField;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({
  embedIndex,
  fieldIndex,
  field
}) => {
  const { updateEmbedField, removeEmbedField } = useBuilderStore();

  const nameLength = field.name.length;
  const valueLength = field.value.length;

  return (
    <div className="bg-discord-darkest/70 border border-discord-border rounded-md p-3.5 flex flex-col gap-3 transition-colors hover:border-[#4e5058]">
      {/* Field Top Row: Inline Toggle & Delete */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-discord-text hover:text-white transition-colors">
          <input
            type="checkbox"
            checked={!!field.inline}
            onChange={(e) =>
              updateEmbedField(embedIndex, fieldIndex, { inline: e.target.checked })
            }
            className="w-4 h-4 rounded bg-discord-input border-discord-border text-discord-blurple focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <span className="font-medium">Inline Field</span>
          <span className="text-[11px] text-discord-muted">(Displays up to 3 per row)</span>
        </label>

        <button
          type="button"
          onClick={() => removeEmbedField(embedIndex, fieldIndex)}
          className="text-discord-muted hover:text-discord-red p-1 rounded transition-colors"
          title="Remove Field"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Field Name Input */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-discord-muted">
            Field Name
          </label>
          <span className={`text-[10.5px] font-mono ${nameLength > 256 ? 'text-discord-red font-bold' : 'text-discord-muted'}`}>
            {nameLength} / 256
          </span>
        </div>
        <input
          type="text"
          value={field.name}
          maxLength={256}
          onChange={(e) =>
            updateEmbedField(embedIndex, fieldIndex, { name: e.target.value })
          }
          placeholder="e.g. Server IP, Price, Requirements"
          className="bg-discord-input border border-discord-border rounded px-3 py-1.5 text-xs sm:text-sm text-discord-text input-glow transition-all"
        />
      </div>

      {/* Field Value Textarea */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-discord-muted">
            Field Value
          </label>
          <span className={`text-[10.5px] font-mono ${valueLength > 1024 ? 'text-discord-red font-bold' : 'text-discord-muted'}`}>
            {valueLength} / 1024
          </span>
        </div>
        <textarea
          rows={2}
          value={field.value}
          maxLength={1024}
          onChange={(e) =>
            updateEmbedField(embedIndex, fieldIndex, { value: e.target.value })
          }
          placeholder="Field content... Markdown and emojis supported."
          className="bg-discord-input border border-discord-border rounded p-2.5 text-xs sm:text-sm text-discord-text input-glow transition-all resize-y font-sans"
        />
      </div>
    </div>
  );
};
