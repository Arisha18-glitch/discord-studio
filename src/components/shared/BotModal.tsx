import React from 'react';
import { Bot, ExternalLink, X, Shield, Sparkles } from 'lucide-react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { getDiscordBotInviteUrl } from '../../utils/discordApi';
import { useToast } from './Toast';

interface BotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BotModal: React.FC<BotModalProps> = ({ isOpen, onClose }) => {
  const { botClientId, setBotClientId } = useBuilderStore();
  const toast = useToast();

  if (!isOpen) return null;

  const handleInvite = () => {
    if (!botClientId.trim()) {
      toast.warning('Please enter your Discord Bot Application / Client ID.');
      return;
    }

    const inviteUrl = getDiscordBotInviteUrl(botClientId);
    if (!inviteUrl) {
      toast.error('Invalid Client ID format.');
      return;
    }

    window.open(inviteUrl, '_blank', 'noopener,noreferrer');
    toast.success('Opened official Discord Bot authorization window!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-discord-sidebar border border-discord-border rounded-xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-discord-border flex items-center justify-between bg-discord-bg">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-discord-blurple/20 text-discord-blurple flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Discord Companion Bot</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-discord-blurple text-white">
                  APP
                </span>
              </h3>
              <p className="text-[11px] text-discord-muted">Invite bot to your server via official OAuth2</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-discord-muted hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-4 text-xs text-discord-text">
          {/* Feature Highlights */}
          <div className="bg-discord-card border border-discord-border p-3.5 rounded-lg flex flex-col gap-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-discord-blurple" />
              <span>What your Discord bot can do:</span>
            </div>
            <ul className="list-disc list-inside text-discord-muted space-y-1 pl-1 text-[11.5px] leading-relaxed">
              <li>Automatically creates webhooks without navigating server settings</li>
              <li>Grabs emoji and role IDs for your embeds via slash commands</li>
              <li>Restores previously sent messages directly from Discord</li>
            </ul>
          </div>

          {/* Bot Application / Client ID Input */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-discord-muted uppercase tracking-wider text-[11px]">
                Bot Application / Client ID
              </label>
              <a
                href="https://discord.com/developers/applications"
                target="_blank"
                rel="noopener noreferrer"
                className="text-discord-link hover:underline font-normal text-[11px] flex items-center gap-1"
              >
                Developer Portal <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="text"
              value={botClientId}
              onChange={(e) => setBotClientId(e.target.value)}
              placeholder="e.g. 123456789012345678"
              className="bg-discord-input border border-discord-border rounded px-3 py-2 text-xs font-mono text-white input-glow transition-all"
            />
            <span className="text-[11px] text-discord-muted/80">
              Create an application on Discord Developer Portal &rarr; Copy Application ID &rarr; Paste here.
            </span>
          </div>

          {/* Security Assurance */}
          <div className="flex items-center gap-2 text-[11px] text-discord-muted bg-white/5 p-2.5 rounded">
            <Shield className="w-4 h-4 text-discord-green flex-shrink-0" />
            <span>Opens Discord&apos;s official authorization window. Zero permissions granted to third parties.</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-discord-border bg-discord-bg flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs text-discord-muted hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInvite}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-discord-blurple hover:bg-discord-blurple-hover text-white text-xs font-semibold shadow-md shadow-discord-blurple/30 transition-all active:scale-95"
          >
            <span>Authorize & Invite Bot</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
