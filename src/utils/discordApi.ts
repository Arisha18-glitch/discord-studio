import { DiscordMessagePayload, WebhookSendResult } from '../types/discord';

/**
 * Constructs an official Discord OAuth2 Bot Authorization URL.
 * Scopes: bot, applications.commands
 * Default Permissions: 534723950656 (Manage Webhooks, Send Messages, Embed Links, History, Slash Commands)
 */
export function getDiscordBotInviteUrl(
  clientId: string,
  permissions = '534723950656'
): string | null {
  if (!clientId || !clientId.trim()) return null;

  const url = new URL('https://discord.com/oauth2/authorize');
  url.searchParams.set('client_id', clientId.trim());
  url.searchParams.set('permissions', permissions);
  url.searchParams.set('scope', 'bot applications.commands');

  return url.toString();
}

/**
 * Validates the syntax of a Discord Webhook URL.
 * Discord Webhook structure: https://discord.com/api/webhooks/{webhook.id}/{webhook.token}
 */
export function validateWebhookUrl(url: string): { valid: boolean; error?: string } {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'Please enter a Discord Webhook URL.' };
  }

  const trimmed = url.trim();
  const discordWebhookRegex = /^https:\/\/(?:ptb\.|canary\.)?discord(?:app)?\.com\/api\/webhooks\/\d{17,20}\/[A-Za-z0-9_-]{60,75}$/;

  if (!discordWebhookRegex.test(trimmed)) {
    return {
      valid: false,
      error: 'Invalid format. Must look like https://discord.com/api/webhooks/{id}/{token}'
    };
  }

  return { valid: true };
}

/**
 * Tests reachability of a Discord Webhook URL via GET request.
 */
export async function testWebhookConnectivity(url: string): Promise<WebhookSendResult> {
  const validation = validateWebhookUrl(url);
  if (!validation.valid) {
    return { success: false, status: 400, message: validation.error || 'Invalid URL' };
  }

  try {
    const response = await fetch(url.trim(), { method: 'GET' });
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        status: response.status,
        message: `Webhook online! Connected to channel in guild: ${data.guild_id || 'Unknown Server'}`
      };
    }

    if (response.status === 404) {
      return { success: false, status: 404, message: 'Webhook not found or has been deleted from Discord.' };
    }
    if (response.status === 401) {
      return { success: false, status: 401, message: 'Invalid Webhook Token. Authorization denied.' };
    }

    return { success: false, status: response.status, message: `Discord returned HTTP status ${response.status}` };
  } catch (error) {
    return {
      success: false,
      status: 0,
      message: error instanceof Error ? error.message : 'Network error reaching Discord API.'
    };
  }
}

/**
 * Strips internal state IDs (like `id` used for React keys) and empty fields,
 * producing a clean Discord API compliant body.
 */
function sanitizePayloadForDiscord(payload: DiscordMessagePayload) {
  const cleanedEmbeds = payload.embeds.map((embed) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, fields, color, author, footer, thumbnail, image, ...rest } = embed;

    const cleanedFields = fields
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter((f) => f.name.trim().length > 0 && f.value.trim().length > 0)
      .map(({ id: _fieldId, ...fieldRest }) => fieldRest);

    return {
      ...rest,
      color: color ? Number(color) : undefined,
      author: author?.name?.trim() ? author : undefined,
      footer: footer?.text?.trim() ? footer : undefined,
      thumbnail: thumbnail?.url?.trim() ? thumbnail : undefined,
      image: image?.url?.trim() ? image : undefined,
      fields: cleanedFields.length > 0 ? cleanedFields : undefined
    };
  });

  // Filter out completely blank embeds
  const activeEmbeds = cleanedEmbeds.filter(
    (e) =>
      e.title ||
      e.description ||
      e.fields ||
      e.image ||
      e.thumbnail ||
      e.author ||
      e.footer
  );

  return {
    username: payload.username?.trim() || undefined,
    avatar_url: payload.avatar_url?.trim() || undefined,
    content: payload.content?.trim() || undefined,
    embeds: activeEmbeds.length > 0 ? activeEmbeds : undefined
  };
}

/**
 * Dispatches the cleaned message payload to Discord API.
 */
export async function sendWebhookPayload(
  url: string,
  payload: DiscordMessagePayload,
  threadId?: string
): Promise<WebhookSendResult> {
  const validation = validateWebhookUrl(url);
  if (!validation.valid) {
    return { success: false, status: 400, message: validation.error || 'Invalid URL' };
  }

  const cleanedBody = sanitizePayloadForDiscord(payload);

  // Discord requires at least content, embeds, or files
  if (!cleanedBody.content && (!cleanedBody.embeds || cleanedBody.embeds.length === 0)) {
    return {
      success: false,
      status: 400,
      message: 'Cannot send an empty message. Please provide either message content or at least one embed.'
    };
  }

  try {
    let targetUrl = `${url.trim()}?wait=true`;
    if (threadId && threadId.trim().length > 0) {
      targetUrl += `&thread_id=${encodeURIComponent(threadId.trim())}`;
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cleanedBody)
    });

    if (response.status === 200 || response.status === 204) {
      return {
        success: true,
        status: response.status,
        message: 'Message successfully delivered to your Discord channel!'
      };
    }

    if (response.status === 429) {
      const rateLimitData = await response.json().catch(() => ({}));
      const retryAfter = rateLimitData.retry_after || 2;
      return {
        success: false,
        status: 429,
        message: `Rate limited by Discord. Please wait ${retryAfter} seconds before trying again.`
      };
    }

    const errorJson = await response.json().catch(() => ({}));
    let detailedMsg = errorJson.message || `Discord returned status ${response.status}`;
    
    // Catch common field errors
    if (errorJson.embeds) {
      detailedMsg += ' (Check embed fields, titles, or image URLs).';
    }

    return {
      success: false,
      status: response.status,
      message: detailedMsg
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      message: error instanceof Error ? error.message : 'Network failure when connecting to Discord.'
    };
  }
}
