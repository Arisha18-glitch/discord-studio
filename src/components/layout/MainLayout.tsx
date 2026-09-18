import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MessageEditor } from '../builder/MessageEditor';
import { EmbedEditor } from '../builder/EmbedEditor';
import { ButtonEditor } from '../builder/ButtonEditor';
import { TemplateSelector } from '../builder/TemplateSelector';
import { JsonEditor } from '../builder/JsonEditor';
import { DiscordPreview } from '../preview/DiscordPreview';

export const MainLayout: React.FC = () => {
  const { activeTab } = useBuilderStore();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-discord-darkest">
      {/* Top Header */}
      <Header />

      {/* 3-Column Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* 1. Left Sidebar Navigation */}
        <Sidebar />

        {/* 2. Center Dynamic Builder Panel */}
        <section className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-discord-bg flex justify-center">
          <div className="w-full max-w-3xl">
            {activeTab === 'message' && <MessageEditor />}
            {activeTab === 'embeds' && <EmbedEditor />}
            {activeTab === 'buttons' && <ButtonEditor />}
            {activeTab === 'templates' && <TemplateSelector />}
            {activeTab === 'json' && <JsonEditor />}
          </div>
        </section>

        {/* 3. Right Live Discord Chat Preview Panel */}
        <section className="flex-1 overflow-hidden hidden md:flex flex-col">
          <DiscordPreview />
        </section>
      </main>
    </div>
  );
};
