import React from 'react';
import { useBuilderStore, ActiveTab } from '../../store/useBuilderStore';
import {
  MessageSquare,
  Layers,
  Boxes,
  Sparkles,
  Code2,
  ShieldCheck
} from 'lucide-react';

interface TabItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, payload } = useBuilderStore();

  const totalButtons = payload.components.reduce(
    (acc, row) => acc + (row.components ? row.components.length : 0),
    0
  );

  const tabs: TabItem[] = [
    {
      id: 'message',
      label: 'Message',
      icon: MessageSquare
    },
    {
      id: 'embeds',
      label: 'Embeds',
      icon: Layers,
      badge: payload.embeds.length
    },
    {
      id: 'buttons',
      label: 'Buttons',
      icon: Boxes,
      badge: totalButtons
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: Sparkles
    },
    {
      id: 'json',
      label: 'Raw JSON',
      icon: Code2
    }
  ];

  return (
    <aside className="w-56 bg-discord-sidebar border-r border-discord-border flex flex-col justify-between p-3 select-none flex-shrink-0">
      {/* Navigation Tabs List */}
      <nav className="flex flex-col gap-1">
        <div className="text-[11px] font-bold text-discord-muted uppercase tracking-wider px-3 py-2">
          Builder Controls
        </div>

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all text-left w-full ${
                isActive
                  ? 'bg-[#35373c] text-white shadow-sm'
                  : 'text-discord-muted hover:text-discord-text hover:bg-white/5'
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? 'text-discord-blurple' : 'text-discord-muted'
                }`}
              />
              <span className="flex-1 truncate">{tab.label}</span>

              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-discord-blurple text-white'
                      : 'bg-black/30 text-discord-muted'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer: Security & Auto-Save */}
      <div className="border-t border-discord-border pt-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 px-2 py-1 text-xs text-discord-muted">
          <span className="w-2 h-2 rounded-full bg-discord-green shadow-[0_0_8px_rgba(87,242,135,0.6)]" />
          <span className="font-medium">Draft Auto-Saved</span>
        </div>

        <div className="flex items-center gap-1.5 px-2 text-[11px] text-discord-muted/80">
          <ShieldCheck className="w-3.5 h-3.5 text-discord-green" />
          <span>Client-Side Safe</span>
        </div>
      </div>
    </aside>
  );
};
