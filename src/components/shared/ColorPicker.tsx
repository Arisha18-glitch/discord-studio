import React from 'react';

interface ColorPickerProps {
  color?: number; // Decimal color used by Discord API
  onChange: (decimalColor?: number) => void;
}

const DISCORD_SWATCHES = [
  { name: 'Blurple', hex: '#5865F2', decimal: 5793266 },
  { name: 'Green', hex: '#57F287', decimal: 5763719 },
  { name: 'Yellow', hex: '#FEE75C', decimal: 16705372 },
  { name: 'Fuchsia', hex: '#EB459E', decimal: 15418782 },
  { name: 'Red', hex: '#ED4245', decimal: 15548997 },
  { name: 'White', hex: '#FFFFFF', decimal: 16777215 },
  { name: 'Dark Grey', hex: '#2B2D31', decimal: 2829617 },
  { name: 'Default Black', hex: '#202225', decimal: 2105893 }
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  // Convert decimal integer to 6-digit hex string
  const currentHex = color !== undefined
    ? `#${color.toString(16).padStart(6, '0').toUpperCase()}`
    : '#5865F2';

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value.replace('#', '');
    const decimal = parseInt(hex, 16);
    onChange(isNaN(decimal) ? undefined : decimal);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.trim();
    if (val.startsWith('#')) val = val.slice(1);

    if (val.length === 0) {
      onChange(undefined);
      return;
    }

    if (/^[0-9A-Fa-f]{1,6}$/.test(val)) {
      const decimal = parseInt(val, 16);
      onChange(isNaN(decimal) ? undefined : decimal);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {/* Native Color Wheel Input Bubble */}
        <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-discord-border flex-shrink-0 cursor-pointer shadow-sm hover:border-discord-blurple transition-colors">
          <input
            type="color"
            value={currentHex}
            onChange={handleColorInputChange}
            className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer border-0 p-0"
            title="Choose custom embed color"
          />
        </div>

        {/* Direct Hex Code Input */}
        <div className="flex items-center bg-discord-input border border-discord-border rounded px-2.5 py-1.5 flex-1 focus-within:border-discord-blurple">
          <span className="text-discord-muted font-mono text-sm mr-1">#</span>
          <input
            type="text"
            maxLength={6}
            value={color !== undefined ? color.toString(16).padStart(6, '0').toUpperCase() : ''}
            onChange={handleTextChange}
            placeholder="5865F2"
            className="bg-transparent text-white font-mono text-xs outline-none w-full uppercase"
          />
        </div>

        {/* Clear Color Button */}
        {color !== undefined && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-xs text-discord-muted hover:text-discord-red px-2 py-1 rounded bg-white/5 hover:bg-discord-red/10 transition-colors"
            title="Remove color accent"
          >
            Clear
          </button>
        )}
      </div>

      {/* Preset Swatches */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1">
        {DISCORD_SWATCHES.map((swatch) => (
          <button
            key={swatch.hex}
            type="button"
            onClick={() => onChange(swatch.decimal)}
            className={`w-6 h-6 rounded border transition-transform hover:scale-110 active:scale-95 ${
              color === swatch.decimal
                ? 'border-white ring-2 ring-discord-blurple/50'
                : 'border-white/20'
            }`}
            style={{ backgroundColor: swatch.hex }}
            title={`${swatch.name} (${swatch.hex})`}
          />
        ))}
      </div>
    </div>
  );
};
