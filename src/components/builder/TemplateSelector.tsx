import React, { useState } from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { useToast } from '../shared/Toast';
import { SERVER_TEMPLATES, ServerTemplate } from '../../utils/templates';
import {
  Sparkles,
  ShieldCheck,
  LifeBuoy,
  CheckCircle2,
  Megaphone,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  ShieldCheck,
  LifeBuoy,
  CheckCircle2,
  Megaphone,
  ShoppingBag
};

export const TemplateSelector: React.FC = () => {
  const { loadTemplate, setActiveTab } = useBuilderStore();
  const toast = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Community', 'Support', 'Moderation', 'Store'];

  const filteredTemplates =
    selectedCategory === 'All'
      ? SERVER_TEMPLATES
      : SERVER_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleApplyTemplate = (template: ServerTemplate) => {
    if (
      window.confirm(
        `Load the "${template.name}" template? This will update your message and embed layout.`
      )
    ) {
      // Clone payload to generate fresh unique IDs
      const clonedPayload = {
        ...template.payload,
        embeds: template.payload.embeds.map((emb) => ({
          ...emb,
          id: crypto.randomUUID(),
          fields: emb.fields.map((f) => ({ ...f, id: crypto.randomUUID() }))
        })),
        components: template.payload.components.map((row) => ({
          ...row,
          id: crypto.randomUUID(),
          components: row.components.map((btn) => ({ ...btn, id: crypto.randomUUID() }))
        }))
      };

      loadTemplate(clonedPayload);
      setActiveTab('embeds');
      toast.success(`Loaded "${template.name}" template!`);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Header */}
      <div className="border-b border-discord-border pb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-discord-blurple" />
          <span>1-Click Server Templates</span>
        </h2>
        <p className="text-xs text-discord-muted mt-1">
          Select a professionally designed template to instantly populate high-converting embeds and button layouts.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-discord-blurple text-white shadow-sm'
                : 'bg-discord-input text-discord-muted hover:text-white hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => {
          const Icon = ICON_MAP[template.icon] || Sparkles;

          return (
            <div
              key={template.id}
              className="bg-discord-card border border-discord-border rounded-lg p-4 flex flex-col justify-between hover:border-discord-blurple transition-all group hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-discord-blurple/10 text-discord-blurple flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-white/5 text-discord-muted">
                    {template.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-discord-blurple transition-colors">
                  {template.name}
                </h3>
                <p className="text-xs text-discord-muted line-clamp-2 leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-discord-border flex items-center justify-between">
                <span className="text-[11px] text-discord-muted font-mono">
                  {template.payload.embeds.length} Embed •{' '}
                  {template.payload.components.reduce(
                    (acc, row) => acc + row.components.length,
                    0
                  )}{' '}
                  Buttons
                </span>

                <button
                  type="button"
                  onClick={() => handleApplyTemplate(template)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-discord-blurple hover:bg-discord-blurple-hover text-white transition-all active:scale-95 shadow-sm"
                >
                  <span>Apply</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
