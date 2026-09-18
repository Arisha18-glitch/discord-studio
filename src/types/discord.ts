/**
 * Official Discord API Types for Webhooks, Embeds, and Message Components
 */

export interface DiscordEmbedAuthor {
  name: string;
  url?: string;
  icon_url?: string;
}

export interface DiscordEmbedFooter {
  text: string;
  icon_url?: string;
}

export interface DiscordEmbedImage {
  url: string;
}

export interface DiscordEmbedThumbnail {
  url: string;
}

export interface DiscordEmbedField {
  id: string; // Internal unique ID for React keys & reordering
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbed {
  id: string; // Internal unique ID for React keys
  title?: string;
  description?: string;
  url?: string;
  color?: number; // Integer decimal representation of hex (e.g. 5793266 for #5865F2)
  timestamp?: string; // ISO8601 string
  author?: DiscordEmbedAuthor;
  footer?: DiscordEmbedFooter;
  thumbnail?: DiscordEmbedThumbnail;
  image?: DiscordEmbedImage;
  fields: DiscordEmbedField[];
}

/**
 * Discord Button Component Styles:
 * 1: Primary (Blurple)
 * 2: Secondary (Grey)
 * 3: Success (Green)
 * 4: Danger (Red)
 * 5: Link (Opens URL in browser)
 */
export type DiscordButtonStyle = 1 | 2 | 3 | 4 | 5;

export interface DiscordButtonComponent {
  id: string; // Internal unique key
  type: 2; // ComponentType.Button = 2
  style: DiscordButtonStyle;
  label: string;
  custom_id?: string; // Required for styles 1-4 (Action buttons)
  url?: string; // Required for style 5 (Link buttons)
  disabled?: boolean;
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean;
  };
}

export interface DiscordActionRow {
  id: string; // Internal unique key
  type: 1; // ComponentType.ActionRow = 1
  components: DiscordButtonComponent[];
}

export interface DiscordMessagePayload {
  username?: string;
  avatar_url?: string;
  content?: string;
  embeds: DiscordEmbed[];
  components: DiscordActionRow[];
}

export interface WebhookSendResult {
  success: boolean;
  status: number;
  message: string;
}
