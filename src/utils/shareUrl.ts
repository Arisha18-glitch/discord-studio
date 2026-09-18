import { DiscordMessagePayload } from '../types/discord';

/**
 * Safely encodes the current message payload into a base64 shareable URL.
 * 
 * SECURITY NOTE:
 * Webhook URLs and private tokens are NEVER included in the share URL,
 * protecting server channels from unauthorized access.
 */
export function encodeStateToShareUrl(payload: DiscordMessagePayload): string {
  try {
    const jsonString = JSON.stringify(payload);
    // Use encodeURIComponent + btoa to support full Unicode / Emojis safely
    const utf8Bytes = encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    );
    const base64 = btoa(utf8Bytes);

    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('data', base64);
    return url.toString();
  } catch (err) {
    console.error('Failed to generate share URL:', err);
    return window.location.href;
  }
}

/**
 * Parses and decodes a payload from the current URL's '?data=' parameter.
 * Returns null if no share parameter is found or if parsing fails.
 */
export function decodeShareUrlToState(): DiscordMessagePayload | null {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data') || urlParams.get('share');
    if (!encodedData) return null;

    const binaryString = atob(encodedData);
    const jsonString = decodeURIComponent(
      Array.prototype.map
        .call(binaryString, (char: string) => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const parsed = JSON.parse(jsonString) as Partial<DiscordMessagePayload>;

    // Ensure structural integrity
    return {
      username: parsed.username || '',
      avatar_url: parsed.avatar_url || '',
      content: parsed.content || '',
      embeds: Array.isArray(parsed.embeds) ? parsed.embeds : [],
      components: Array.isArray(parsed.components) ? parsed.components : []
    };
  } catch (err) {
    console.warn('Could not decode share parameter from URL:', err);
    return null;
  }
}

/**
 * Generates the share URL and copies it directly to the system clipboard.
 */
export async function copyShareLinkToClipboard(payload: DiscordMessagePayload): Promise<boolean> {
  const shareUrl = encodeStateToShareUrl(payload);
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(shareUrl);
      return true;
    }
    // Fallback for older browser contexts
    const textArea = document.createElement('textarea');
    textArea.value = shareUrl;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}
