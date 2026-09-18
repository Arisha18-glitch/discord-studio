import React, { useState } from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { useToast } from '../shared/Toast';
import { sendWebhookPayload, testWebhookConnectivity } from '../../utils/discordApi';
import { copyShareLinkToClipboard } from '../../utils/shareUrl';
import {
  Send,
  Stethoscope,
  Link,
  Eye,
  EyeOff,
  Share2,
  RotateCcw,
  FileDown,
  Loader2,
  Bot
} from 'lucide-react';
import { BotModal } from '../shared/BotModal';

export const Header: React.FC = () => {
  const { webhookUrl, setWebhookUrl, payload, resetPayload, threadId } = useBuilderStore();
  const toast = useToast();

  const [showWebhook, setShowWebhook] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isBotModalOpen, setIsBotModalOpen] = useState(false);

  // Test Webhook connectivity
  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      toast.warning('Please paste a Discord Webhook URL first.');
      return;
    }

    setIsTesting(true);
    try {
      const res = await testWebhookConnectivity(webhookUrl);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } finally {
      setIsTesting(false);
    }
  };

  // Send message to Discord Webhook
  const handleSendMessage = async () => {
    if (!webhookUrl.trim()) {
      toast.warning('Please paste a Discord Webhook URL to send this message.');
      return;
    }

    setIsSending(true);
    try {
      const res = await sendWebhookPayload(webhookUrl, payload, threadId);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } finally {
      setIsSending(false);
    }
  };

  // Copy token-safe shareable link
  const handleShare = async () => {
    const success = await copyShareLinkToClipboard(payload);
    if (success) {
      toast.success('Shareable link copied to clipboard! (Webhook URL safely omitted)');
    } else {
      toast.error('Failed to copy link to clipboard.');
    }
  };

  // Export current payload as JSON file
  const handleExportJson = () => {
    try {
      const jsonString = JSON.stringify(payload, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `discord-studio-payload-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('JSON payload exported successfully!');
    } catch {
      toast.error('Failed to export JSON payload.');
    }
  };

  // Reset to default payload
  const handleReset = () => {
    if (window.confirm('Reset this message and all embeds to default settings?')) {
      resetPayload();
      toast.info('Message draft reset to default.');
    }
  };

  return (
    <header className="h-16 bg-discord-bg border-b border-discord-border px-4 sm:px-6 flex items-center justify-between gap-4 z-30 flex-shrink-0">
      {/* Brand Identity */}
      <div className="flex items-center gap-3 min-w-[210px] select-none">
        <div className="w-9 h-9 bg-discord-blurple rounded-xl flex items-center justify-center text-white shadow-md shadow-discord-blurple/30">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-[15px] tracking-tight">Discord Studio</span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-discord-blurple/20 text-discord-link border border-discord-blurple/30 tracking-wide">
              Studio
            </span>
          </div>
          <p className="text-[11px] text-discord-muted font-normal">Visual Webhook & Embed Designer</p>
        </div>

        {/* Discord Bot Invite Action (Discohook style) */}
        <button
          type="button"
          onClick={() => setIsBotModalOpen(true)}
          className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-discord-muted hover:text-white hover:bg-white/5 border border-discord-border/50 hover:border-discord-blurple transition-colors ml-1"
          title="Invite Companion Discord Bot"
        >
          <Bot className="w-3.5 h-3.5 text-discord-blurple" />
          <span>Discord Bot</span>
        </button>
      </div>

      {/* Webhook Input Bar */}
      <div className="flex-1 max-w-2xl flex items-center gap-2">
        <div className="flex-1 flex items-center bg-discord-input border border-discord-border rounded-md px-3 py-1.5 focus-within:border-discord-blurple transition-all shadow-inner">
          <Link className="w-4 h-4 text-discord-muted mr-2.5 flex-shrink-0" />
          <input
            type={showWebhook ? 'text' : 'password'}
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="Paste Discord Webhook URL (https://discord.com/api/webhooks/...)"
            spellCheck={false}
            autoComplete="off"
            className="bg-transparent text-xs sm:text-sm text-discord-text placeholder-discord-muted outline-none w-full font-mono"
          />
          <button
            type="button"
            onClick={() => setShowWebhook((prev) => !prev)}
            className="text-discord-muted hover:text-white p-1 rounded transition-colors"
            title={showWebhook ? 'Hide Webhook URL' : 'Show Webhook URL'}
          >
            {showWebhook ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            disabled={isTesting}
            onClick={handleTestWebhook}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-medium bg-[#4e5058] hover:bg-[#6d6f78] text-white transition-colors disabled:opacity-50"
            title="Check if webhook token is active"
          >
            {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Stethoscope className="w-3.5 h-3.5" />}
            <span>Test</span>
          </button>

          <button
            type="button"
            disabled={isSending}
            onClick={handleSendMessage}
            className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs sm:text-sm font-semibold bg-discord-blurple hover:bg-discord-blurple-hover text-white shadow-md shadow-discord-blurple/30 transition-all active:scale-95 disabled:opacity-50"
            title="Publish directly to Discord"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Send to Discord</span>
          </button>
        </div>
      </div>

      {/* Top Utilities */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={handleShare}
          className="p-2 rounded text-discord-muted hover:text-white hover:bg-white/5 transition-colors"
          title="Copy Shareable Link"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleExportJson}
          className="p-2 rounded text-discord-muted hover:text-white hover:bg-white/5 transition-colors"
          title="Export JSON Payload"
        >
          <FileDown className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="p-2 rounded text-discord-muted hover:text-discord-red hover:bg-discord-red/10 transition-colors"
          title="Reset Draft"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Companion Bot OAuth2 Authorization Modal */}
      <BotModal
        isOpen={isBotModalOpen}
        onClose={() => setIsBotModalOpen(false)}
      />
    </header>
  );
};
