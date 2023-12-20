import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'bg-gradient-from': '#9747FF',
        'bg-gradient-to': '#7D4BFF',
      },
      fontWeight: {
        '400': '400',
      },
      maxHeight: {
        '24rem': '24rem',
      },
      height: {
        '42px': '42px',
      },
      width: {
        '65px': '65px',
      },
    },
  },
  plugins: [],
};
export default config;
