import { DiscordMessagePayload } from '../types/discord';

export interface ServerTemplate {
  id: string;
  name: string;
  category: 'Community' | 'Support' | 'Moderation' | 'Store';
  icon: string;
  description: string;
  payload: DiscordMessagePayload;
}

export const SERVER_TEMPLATES: ServerTemplate[] = [
  {
    id: 'server-rules',
    name: 'Server Rules & Code of Conduct',
    category: 'Moderation',
    icon: 'ShieldCheck',
    description: 'A comprehensive, authoritative rulebook with clean numbered sections and warning policies.',
    payload: {
      username: 'Community Moderation',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/1.png',
      content: 'Please review our server rules carefully before participating in the community.',
      embeds: [
        {
          id: crypto.randomUUID(),
          title: '📜 Official Server Guidelines & Rules',
          description: 'Welcome to our server! To ensure a friendly, safe, and productive space for everyone, all members must abide by the rules outlined below.\n\n*Violations may result in warnings, temporary mutes, or permanent bans without prior notice.*',
          color: 0xED4245, // Discord Red
          fields: [
            {
              id: crypto.randomUUID(),
              name: '1. Respect All Members',
              value: 'Harassment, hate speech, racism, sexism, or toxic behavior of any kind is strictly prohibited.',
              inline: false
            },
            {
              id: crypto.randomUUID(),
              name: '2. No Spam or Self-Promotion',
              value: 'Do not advertise external servers, social media, or affiliate links without explicit moderator approval.',
              inline: false
            },
            {
              id: crypto.randomUUID(),
              name: '3. Keep Channels On-Topic',
              value: 'Post relevant content in appropriate designated channels (e.g. #general, #media, #bot-commands).',
              inline: false
            },
            {
              id: crypto.randomUUID(),
              name: '4. Follow Discord Community Guidelines',
              value: 'You must strictly adhere to Discord\'s official Terms of Service and Community Guidelines.',
              inline: false
            }
          ],
          footer: {
            text: 'Server Administration Team • Last updated',
            icon_url: 'https://cdn.discordapp.com/embed/avatars/1.png'
          },
          timestamp: new Date().toISOString()
        }
      ],
      components: [
        {
          id: crypto.randomUUID(),
          type: 1,
          components: [
            {
              id: crypto.randomUUID(),
              type: 2,
              style: 5,
              label: 'Discord Terms of Service',
              url: 'https://discord.com/terms'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'ticket-panel',
    name: 'Support & Ticket Panel',
    category: 'Support',
    icon: 'LifeBuoy',
    description: 'Clean customer support / order assistance opener with department guidelines.',
    payload: {
      username: 'Support Desk',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/2.png',
      content: '',
      embeds: [
        {
          id: crypto.randomUUID(),
          title: '🎫 Need Assistance? Open a Support Ticket',
          description: 'Our dedicated staff is here to help you. Select the relevant category below and a private ticket channel will be created with our team.',
          color: 0x5865F2, // Discord Blurple
          fields: [
            {
              id: crypto.randomUUID(),
              name: '🕒 Response Times',
              value: 'Typically within 1–2 hours during active working hours.',
              inline: true
            },
            {
              id: crypto.randomUUID(),
              name: '📋 What to Provide',
              value: 'Order ID, transaction receipt, or a clear screenshot of your issue.',
              inline: true
            }
          ],
          footer: {
            text: '24/7 Member Helpdesk',
            icon_url: 'https://cdn.discordapp.com/embed/avatars/2.png'
          }
        }
      ],
      components: [
        {
          id: crypto.randomUUID(),
          type: 1,
          components: [
            {
              id: crypto.randomUUID(),
              type: 2,
              style: 5,
              label: 'Knowledgebase & FAQ',
              url: 'https://discord.com'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'verification-gate',
    name: 'Member Verification Gate',
    category: 'Moderation',
    icon: 'CheckCircle2',
    description: 'Security gate embed instructing new members how to gain full server access.',
    payload: {
      username: 'Security System',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
      content: '',
      embeds: [
        {
          id: crypto.randomUUID(),
          title: '🔒 Member Verification Gate',
          description: 'To protect our community against automated raid bots and spam accounts, all newcomers must verify before unlocking chat channels.\n\nClick the link below to verify your account or confirm your member status.',
          color: 0x57F287, // Discord Green
          fields: [
            {
              id: crypto.randomUUID(),
              name: '🛡️ Anti-Raid Protection',
              value: 'Accounts must be older than 3 days to complete automatic verification.',
              inline: true
            },
            {
              id: crypto.randomUUID(),
              name: '⚡ Instant Access',
              value: 'Unlocks all member voice and text channels immediately.',
              inline: true
            }
          ],
          footer: {
            text: 'Automated Community Defense'
          }
        }
      ],
      components: [
        {
          id: crypto.randomUUID(),
          type: 1,
          components: [
            {
              id: crypto.randomUUID(),
              type: 2,
              style: 5,
              label: 'Read Member Handbook',
              url: 'https://discord.com'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'announcement-update',
    name: 'Official Server Announcement',
    category: 'Community',
    icon: 'Megaphone',
    description: 'High-impact announcement embed for major updates, features, and events.',
    payload: {
      username: 'Server Broadcast',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/4.png',
      content: '@everyone 📢 **A Major Server Update Has Just Gone Live!**',
      embeds: [
        {
          id: crypto.randomUUID(),
          title: '✨ Version 2.0 Feature Release & Community Update',
          description: 'We are thrilled to unveil our brand new server overhaul! Our team has been hard at work making improvements across all systems.\n\nHere is a breakdown of everything that is new:',
          color: 0xFEE75C, // Discord Yellow
          fields: [
            {
              id: crypto.randomUUID(),
              name: '🚀 New Leveling System',
              value: 'Chat actively to earn XP, unlock exclusive custom role colors, and earn badges.',
              inline: false
            },
            {
              id: crypto.randomUUID(),
              name: '🎮 Weekly Community Tournaments',
              value: 'Sign up in #tournaments to compete for nitro prizes every Saturday!',
              inline: false
            },
            {
              id: crypto.randomUUID(),
              name: '🎁 Milestone Giveaway',
              value: 'Check #giveaways for our 5,000 member celebratory giveaway.',
              inline: false
            }
          ],
          footer: {
            text: 'Thank you for being part of our journey!'
          },
          timestamp: new Date().toISOString()
        }
      ],
      components: []
    }
  },
  {
    id: 'store-pricing',
    name: 'VIP & Store Pricing Table',
    category: 'Store',
    icon: 'ShoppingBag',
    description: 'Product and subscription tiers with perks and checkout links.',
    payload: {
      username: 'Store Bot',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/3.png',
      content: '',
      embeds: [
        {
          id: crypto.randomUUID(),
          title: '💎 Premium VIP Memberships & Server Perks',
          description: 'Support the server infrastructure and unlock exclusive benefits, VIP channels, and priority perks.',
          color: 0xEB459E, // Discord Fuchsia
          fields: [
            {
              id: crypto.randomUUID(),
              name: '🥉 Bronze Tier — $4.99/mo',
              value: '• Exclusive Bronze Role\n• Access to #vip-lounge\n• Priority Support Queue',
              inline: true
            },
            {
              id: crypto.randomUUID(),
              name: '🥈 Silver Tier — $9.99/mo',
              value: '• All Bronze Perks\n• Custom Role Icon\n• 2x Giveaway Entries',
              inline: true
            },
            {
              id: crypto.randomUUID(),
              name: '🥇 Gold VIP — $19.99/mo',
              value: '• All Silver Perks\n• Personal Private Voice Channel\n• Direct Admin Access',
              inline: true
            }
          ],
          footer: {
            text: 'Instant Automated Delivery via Webhook'
          }
        }
      ],
      components: [
        {
          id: crypto.randomUUID(),
          type: 1,
          components: [
            {
              id: crypto.randomUUID(),
              type: 2,
              style: 5,
              label: 'Visit Official Web Store',
              url: 'https://discord.com'
            }
          ]
        }
      ]
    }
  }
];
