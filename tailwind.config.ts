import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand — cyan
        primary: {
          DEFAULT: '#4FE3F0',
          hover: '#7EEFF7',
          active: '#2EC8D4',
          glow: '#4FE3F033',
        },
        // Violet secondary
        violet: {
          DEFAULT: '#9A7BFF',
          bg: '#9A7BFF1A',
        },
        // Backgrounds
        background: {
          page: '#0A0B0D',
          'page-secondary': '#0E1014',
          card: '#14171D',
          'card-hover': '#1A1E26',
          elevated: '#1A1E26',
          input: '#0E1014',
        },
        // Text
        text: {
          primary: '#E8EAED',
          secondary: '#9AA3B5',
          tertiary: '#6B7180',
          disabled: '#4B5260',
          inverse: '#0A0B0D',
        },
        // Borders
        border: {
          DEFAULT: '#23272F',
          hover: '#2D3240',
          focus: '#4FE3F066',
          subtle: '#1A1E26',
        },
        // Semantic
        positive: {
          DEFAULT: '#2ED891',
          hover: '#45EFA3',
          bg: '#2ED8911A',
        },
        negative: {
          DEFAULT: '#FF5872',
          hover: '#FF7A8F',
          bg: '#FF58721A',
        },
        warning: {
          DEFAULT: '#FFB347',
          bg: '#FFB3471A',
        },
        info: {
          DEFAULT: '#4FE3F0',
          bg: '#4FE3F01A',
        },
        // Chart
        chart: {
          line: {
            primary: '#4FE3F0',
            secondary: '#2ED891',
          },
          grid: '#23272F',
          axis: '#6B7180',
          tooltip: '#14171D',
          area: {
            start: '#4FE3F033',
            end: '#4FE3F000',
          },
        },
        // Status
        status: {
          live: '#2ED891',
          upcoming: '#FFB347',
          resolved: '#6B7180',
          cancelled: '#FF5872',
        },
      },
      fontFamily: {
        sans:    ['DM Sans', 'var(--font-body)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Instrument Serif', 'Georgia', 'serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'SF Mono', 'monospace'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['14px', { lineHeight: '1.5' }],
        base: ['16px', { lineHeight: '1.5' }],
        lg: ['18px', { lineHeight: '1.5' }],
        xl: ['20px', { lineHeight: '1.375' }],
        '2xl': ['24px', { lineHeight: '1.375' }],
        '3xl': ['32px', { lineHeight: '1.2' }],
        '4xl': ['40px', { lineHeight: '1.2' }],
        '5xl': ['48px', { lineHeight: '1.2' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        base: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        full: '9999px',
      },
      boxShadow: {
        sm:           '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        DEFAULT:      '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.5)',
        md:           '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)',
        lg:           '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.6)',
        xl:           '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.6)',
        glow:         '0 0 20px #4FE3F044',
        'glow-strong':'0 0 30px #4FE3F077',
      },
      transitionDuration: {
        fast: '150ms',
        DEFAULT: '200ms',
        slow: '300ms',
        smooth: '400ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      maxWidth: {
        container: '100%',
      },
      zIndex: {
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        'modal-backdrop': '1040',
        modal: '1050',
        popover: '1060',
        tooltip: '1070',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4FE3F0, #9A7BFF)',
        'gradient-chart':   'linear-gradient(to bottom, #4FE3F033, #4FE3F000)',
      },
    },
  },
  plugins: [],
};

export default config;
