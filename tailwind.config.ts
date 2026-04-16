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
        // Primary colors
        primary: {
          DEFAULT: '#7B73FF',
          gradient: {
            start: '#6C63FF',
            end: '#8A7CFF',
          },
          hover: '#8A7CFF',
          active: '#5B52EE',
        },
        // Background colors
        background: {
          page: '#0B0F1A',
          'page-secondary': '#0F1424',
          card: '#12182B',
          'card-hover': '#151C30',
          elevated: '#1A2235',
          input: '#0F1424',
        },
        // Text colors
        text: {
          primary: '#FFFFFF',
          secondary: '#A0A7C0',
          tertiary: '#6B7280',
          disabled: '#4B5563',
          inverse: '#0B0F1A',
        },
        // Border colors
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.12)',
          focus: 'rgba(123, 115, 255, 0.4)',
          subtle: 'rgba(255, 255, 255, 0.04)',
        },
        // Semantic colors
        positive: {
          DEFAULT: '#16C784',
          hover: '#1DD990',
          bg: 'rgba(22, 199, 132, 0.1)',
        },
        negative: {
          DEFAULT: '#EA3943',
          hover: '#F04851',
          bg: 'rgba(234, 57, 67, 0.1)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          bg: 'rgba(245, 158, 11, 0.1)',
        },
        info: {
          DEFAULT: '#3B82F6',
          bg: 'rgba(59, 130, 246, 0.1)',
        },
        // Chart colors
        chart: {
          line: {
            primary: '#7B73FF',
            secondary: '#16C784',
          },
          grid: 'rgba(255, 255, 255, 0.05)',
          axis: '#4B5563',
          tooltip: '#1A2235',
          area: {
            start: 'rgba(123, 115, 255, 0.2)',
            end: 'rgba(123, 115, 255, 0)',
          },
        },
        // Status colors
        status: {
          live: '#16C784',
          upcoming: '#F59E0B',
          resolved: '#6B7280',
          cancelled: '#EA3943',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
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
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        glow: '0 0 20px rgba(123, 115, 255, 0.3)',
        'glow-strong': '0 0 30px rgba(123, 115, 255, 0.5)',
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
        'gradient-primary': 'linear-gradient(135deg, #6C63FF, #8A7CFF)',
        'gradient-chart': 'linear-gradient(to bottom, rgba(123, 115, 255, 0.2), rgba(123, 115, 255, 0))',
      },
    },
  },
  plugins: [],
};

export default config;
