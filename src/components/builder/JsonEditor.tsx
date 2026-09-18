import React, { useState, useEffect } from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { useToast } from '../shared/Toast';
import { DiscordMessagePayload } from '../../types/discord';
import { Code2, Copy, Check, FileCheck, AlertCircle } from 'lucide-react';

export const JsonEditor: React.FC = () => {
  const { payload, setPayload } = useBuilderStore();
  const toast = useToast();

  const [rawJson, setRawJson] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Sync state payload to JSON text
  useEffect(() => {
    // Strip internal IDs for clean, Discohook-compatible Discord API JSON
    const cleanEmbeds = payload.embeds.map(({ id: _eId, fields, ...rest }) => ({
      ...rest,
      fields: fields.map(({ id: _fId, ...fRest }) => fRest)
    }));

    const cleanComponents = payload.components.map(({ id: _rId, components, ...rowRest }) => ({
      ...rowRest,
      components: components.map(({ id: _bId, ...btnRest }) => btnRest)
    }));

    const apiPayload = {
      username: payload.username || undefined,
      avatar_url: payload.avatar_url || undefined,
      content: payload.content || undefined,
      embeds: cleanEmbeds.length > 0 ? cleanEmbeds : undefined,
      components: cleanComponents.length > 0 ? cleanComponents : undefined
    };

    setRawJson(JSON.stringify(apiPayload, null, 2));
    setJsonError(null);
  }, [payload]);

  // Apply typed/pasted JSON back to the visual builder
  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(rawJson);

      // Support Discohook wrapper or standard Discord payload
      const incoming = parsed.data || parsed;

      const updatedPayload: DiscordMessagePayload = {
        username: incoming.username || '',
        avatar_url: incoming.avatar_url || '',
        content: incoming.content || '',
        embeds: Array.isArray(incoming.embeds)
          ? incoming.embeds.map((emb: any) => ({
              ...emb,
              id: crypto.randomUUID(),
              fields: Array.isArray(emb.fields)
                ? emb.fields.map((f: any) => ({ ...f, id: crypto.randomUUID() }))
                : []
            }))
          : [],
        components: Array.isArray(incoming.components)
          ? incoming.components.map((row: any) => ({
              ...row,
              id: crypto.randomUUID(),
              components: Array.isArray(row.components)
                ? row.components.map((btn: any) => ({ ...btn, id: crypto.randomUUID() }))
                : []
            }))
          : []
      };

      setPayload(updatedPayload);
      setJsonError(null);
      toast.success('JSON applied successfully to Visual Builder!');
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Invalid JSON format';
      setJsonError(errMsg);
      toast.error('Could not apply JSON: ' + errMsg);
    }
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(rawJson);
      setCopied(true);
      toast.success('Raw JSON copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Failed to copy JSON.');
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl h-[calc(100vh-140px)]">
      {/* Header & Tools */}
      <div className="flex items-center justify-between border-b border-discord-border pb-3 flex-wrap gap-2 flex-shrink-0">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-discord-blurple" />
            <span>Raw Discord Payload (JSON)</span>
          </h2>
          <p className="text-xs text-discord-muted mt-0.5">
            Directly edit, copy, or paste Discord/Discohook JSON payloads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#4e5058] hover:bg-[#6d6f78] text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-discord-green" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>

          <button
            type="button"
            onClick={handleApplyJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-discord-blurple hover:bg-discord-blurple-hover text-white transition-colors shadow-sm"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Apply to Builder</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {jsonError && (
        <div className="bg-discord-red/10 border border-discord-red/40 p-2.5 rounded text-xs text-discord-red flex items-center gap-2 flex-shrink-0">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{jsonError}</span>
        </div>
      )}

      {/* Monospace JSON Textarea */}
      <div className="flex-1 bg-[#141517] border border-discord-border rounded-lg overflow-hidden flex flex-col shadow-inner">
        <textarea
          value={rawJson}
          onChange={(e) => {
            setRawJson(e.target.value);
            setJsonError(null);
          }}
          spellCheck={false}
          className="flex-1 w-full bg-transparent p-4 font-mono text-xs sm:text-[13px] text-[#a6e3a1] leading-relaxed outline-none resize-none selection:bg-discord-blurple selection:text-white"
        />
      </div>
    </div>
  );
};
