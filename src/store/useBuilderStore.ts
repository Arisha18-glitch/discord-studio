import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DiscordMessagePayload,
  DiscordEmbed,
  DiscordEmbedField,
  DiscordActionRow,
  DiscordButtonComponent
} from '../types/discord';

export type ActiveTab = 'message' | 'embeds' | 'buttons' | 'templates' | 'json';

interface BuilderState {
  webhookUrl: string;
  threadId: string;
  activeTab: ActiveTab;
  activeEmbedIndex: number;
  payload: DiscordMessagePayload;

  // Navigation & Config
  setWebhookUrl: (url: string) => void;
  setThreadId: (threadId: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setActiveEmbedIndex: (index: number) => void;

  // Message Identity Actions
  setPayload: (payload: DiscordMessagePayload) => void;
  updateMessageContent: (content: string) => void;
  updateWebhookProfile: (username?: string, avatar_url?: string) => void;

  // Embeds CRUD Actions
  addEmbed: () => void;
  removeEmbed: (index: number) => void;
  updateEmbed: (index: number, embedData: Partial<DiscordEmbed>) => void;

  // Field CRUD Actions (per embed)
  addEmbedField: (embedIndex: number) => void;
  updateEmbedField: (embedIndex: number, fieldIndex: number, fieldData: Partial<DiscordEmbedField>) => void;
  removeEmbedField: (embedIndex: number, fieldIndex: number) => void;

  // Interactive Buttons CRUD Actions
  addButtonRow: () => void;
  removeButtonRow: (rowIndex: number) => void;
  addButton: (rowIndex: number) => void;
  updateButton: (rowIndex: number, btnIndex: number, btnData: Partial<DiscordButtonComponent>) => void;
  removeButton: (rowIndex: number, btnIndex: number) => void;

  // Global Presets & Reset
  loadTemplate: (templatePayload: DiscordMessagePayload) => void;
  resetPayload: () => void;
}

const initialPayload: DiscordMessagePayload = {
  username: 'Discord Studio',
  avatar_url: '',
  content: 'Welcome to **Discord Studio**! Edit fields on the left to see live real-time updates.',
  embeds: [
    {
      id: crypto.randomUUID(),
      title: '🚀 Professional Embed Designer',
      description: 'Design beautiful, rich Discord embeds with real-time live preview matching Discord\'s exact layout engine.',
      url: 'https://discord.com',
      color: 5793266, // #5865F2 (Discord Blurple)
      author: {
        name: 'Discord Studio Bot',
        icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
      },
      fields: [
        {
          id: crypto.randomUUID(),
          name: '✨ Live Preview',
          value: 'Changes update instantaneously.',
          inline: true
        },
        {
          id: crypto.randomUUID(),
          name: '🛡️ 100% Safe',
          value: 'Runs entirely in your browser.',
          inline: true
        }
      ],
      footer: {
        text: 'Discord Studio • Webhook Studio',
        icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
      },
      timestamp: new Date().toISOString()
    }
  ],
  components: []
};

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set) => ({
      webhookUrl: '',
      threadId: '',
      activeTab: 'message',
      activeEmbedIndex: 0,
      payload: initialPayload,

      setWebhookUrl: (webhookUrl) => set({ webhookUrl }),
      setThreadId: (threadId) => set({ threadId }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setActiveEmbedIndex: (activeEmbedIndex) => set({ activeEmbedIndex }),

      setPayload: (payload) => set({ payload }),

      updateMessageContent: (content) =>
        set((state) => ({ payload: { ...state.payload, content } })),

      updateWebhookProfile: (username, avatar_url) =>
        set((state) => ({ payload: { ...state.payload, username, avatar_url } })),

      addEmbed: () =>
        set((state) => {
          if (state.payload.embeds.length >= 10) return state; // Discord API max 10 embeds per message
          const newEmbed: DiscordEmbed = {
            id: crypto.randomUUID(),
            title: `Embed #${state.payload.embeds.length + 1}`,
            description: '',
            color: 5793266,
            fields: []
          };
          return {
            payload: { ...state.payload, embeds: [...state.payload.embeds, newEmbed] },
            activeEmbedIndex: state.payload.embeds.length
          };
        }),

      removeEmbed: (index) =>
        set((state) => ({
          payload: {
            ...state.payload,
            embeds: state.payload.embeds.filter((_, i) => i !== index)
          },
          activeEmbedIndex: Math.max(0, index - 1)
        })),

      updateEmbed: (index, embedData) =>
        set((state) => {
          const updatedEmbeds = [...state.payload.embeds];
          if (!updatedEmbeds[index]) return state;
          updatedEmbeds[index] = { ...updatedEmbeds[index], ...embedData };
          return { payload: { ...state.payload, embeds: updatedEmbeds } };
        }),

      addEmbedField: (embedIndex) =>
        set((state) => {
          const updatedEmbeds = [...state.payload.embeds];
          const targetEmbed = updatedEmbeds[embedIndex];
          if (!targetEmbed || targetEmbed.fields.length >= 25) return state; // Discord max 25 fields per embed

          targetEmbed.fields.push({
            id: crypto.randomUUID(),
            name: 'New Field Name',
            value: 'Field description or value',
            inline: false
          });
          return { payload: { ...state.payload, embeds: updatedEmbeds } };
        }),

      updateEmbedField: (embedIndex, fieldIndex, fieldData) =>
        set((state) => {
          const updatedEmbeds = [...state.payload.embeds];
          if (!updatedEmbeds[embedIndex]?.fields[fieldIndex]) return state;

          updatedEmbeds[embedIndex].fields[fieldIndex] = {
            ...updatedEmbeds[embedIndex].fields[fieldIndex],
            ...fieldData
          };
          return { payload: { ...state.payload, embeds: updatedEmbeds } };
        }),

      removeEmbedField: (embedIndex, fieldIndex) =>
        set((state) => {
          const updatedEmbeds = [...state.payload.embeds];
          if (!updatedEmbeds[embedIndex]) return state;

          updatedEmbeds[embedIndex].fields = updatedEmbeds[embedIndex].fields.filter(
            (_, i) => i !== fieldIndex
          );
          return { payload: { ...state.payload, embeds: updatedEmbeds } };
        }),

      addButtonRow: () =>
        set((state) => {
          if (state.payload.components.length >= 5) return state; // Discord max 5 ActionRows
          const newRow: DiscordActionRow = {
            id: crypto.randomUUID(),
            type: 1,
            components: []
          };
          return {
            payload: { ...state.payload, components: [...state.payload.components, newRow] }
          };
        }),

      removeButtonRow: (rowIndex) =>
        set((state) => ({
          payload: {
            ...state.payload,
            components: state.payload.components.filter((_, i) => i !== rowIndex)
          }
        })),

      addButton: (rowIndex) =>
        set((state) => {
          const updatedComponents = [...state.payload.components];
          const targetRow = updatedComponents[rowIndex];
          if (!targetRow || targetRow.components.length >= 5) return state; // Discord max 5 buttons per row

          const newButton: DiscordButtonComponent = {
            id: crypto.randomUUID(),
            type: 2,
            style: 5, // Default to Link Button (works immediately with Webhooks)
            label: 'Visit Website',
            url: 'https://discord.com'
          };

          targetRow.components.push(newButton);
          return { payload: { ...state.payload, components: updatedComponents } };
        }),

      updateButton: (rowIndex, btnIndex, btnData) =>
        set((state) => {
          const updatedComponents = [...state.payload.components];
          if (!updatedComponents[rowIndex]?.components[btnIndex]) return state;

          updatedComponents[rowIndex].components[btnIndex] = {
            ...updatedComponents[rowIndex].components[btnIndex],
            ...btnData
          };
          return { payload: { ...state.payload, components: updatedComponents } };
        }),

      removeButton: (rowIndex, btnIndex) =>
        set((state) => {
          const updatedComponents = [...state.payload.components];
          if (!updatedComponents[rowIndex]) return state;

          updatedComponents[rowIndex].components = updatedComponents[rowIndex].components.filter(
            (_, i) => i !== btnIndex
          );
          return { payload: { ...state.payload, components: updatedComponents } };
        }),

      loadTemplate: (templatePayload) =>
        set({ payload: templatePayload, activeEmbedIndex: 0 }),

      resetPayload: () =>
        set({ payload: initialPayload, activeEmbedIndex: 0 })
    }),
    {
      name: 'discord-studio-storage' // Persisted in localStorage automatically
    }
  )
);
