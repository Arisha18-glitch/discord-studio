/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        discord: {
          bg: '#1e1f22',            // Primary app surface
          darkest: '#111214',       // Base backdrop
          sidebar: '#2b2d31',       // Navigation & secondary panels
          chat: '#313338',          // Exact Discord chat stream background
          card: '#2b2d31',          // Embed & settings card surface
          input: '#1e1f22',         // Form inputs background
          border: '#383a40',        // Discord dividing borders
          blurple: '#5865f2',       // Official Discord Blurple brand accent
          'blurple-hover': '#4752c4',
          green: '#57f287',         // Discord success / online green
          'green-hover': '#43b581',
          yellow: '#fee75c',        // Discord warning / idle yellow
          red: '#ed4245',           // Discord danger / dnd red
          'red-hover': '#da373c',
          text: '#dbdee1',          // Normal message text
          muted: '#949ba4',         // Timestamps and secondary labels
          white: '#ffffff',
          link: '#00a8fc'           // Discord embedded link blue
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    },
  },
  plugins: [],
}
