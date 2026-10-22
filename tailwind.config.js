/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    // Type scale. Replaces Tailwind's defaults, so only these sizes exist.
    // Each carries its line height; don't add `leading-*` or `text-[Npx]`.
    //   xs  — captions, helper/error text, badges, eyebrow labels
    //   sm  — body text, inputs, field labels, buttons, links
    //   lg  — section and card titles, app name in the header
    //   2xl — screen titles only
    fontSize: {
      xs: ['13px', { lineHeight: '18px' }],
      sm: ['15px', { lineHeight: '22px' }],
      lg: ['19px', { lineHeight: '24px' }],
      '2xl': ['30px', { lineHeight: '38px' }],
    },
    extend: {
      // CloneCV design-system tokens. Use with `dark:` for the dark values,
      // e.g. `bg-surface dark:bg-surface-dark`.
      colors: {
        surface: { DEFAULT: '#F6F9FC', dark: '#0B1426' },
        'surface-raised': { DEFAULT: '#FFFFFF', dark: '#121E36' },
        'surface-sunken': { DEFAULT: '#EDF2F8', dark: '#08101F' },
        line: { DEFAULT: '#DCE4EE', dark: '#24324F' },
        'line-strong': { DEFAULT: '#7686A1', dark: '#6C7FA3' },
        ink: { DEFAULT: '#0F1E3D', dark: '#EEF3FA' },
        'ink-muted': { DEFAULT: '#4E5D78', dark: '#A6B4CA' },
        navy: '#0F1E3D',
        'on-navy': '#FFFFFF',
        sky: { DEFAULT: '#2563C9', dark: '#6AAEFF' },
        'sky-pressed': { DEFAULT: '#1D51A8', dark: '#8EC2FF' },
        'on-sky': { DEFAULT: '#FFFFFF', dark: '#0B1426' },
        'sky-soft': { DEFAULT: '#E4EFFE', dark: '#14305C' },
        mint: { DEFAULT: '#2FC496', dark: '#3ED6A5' },
        'mint-ink': { DEFAULT: '#0A7154', dark: '#5FE0B5' },
        'mint-soft': { DEFAULT: '#DDF7EC', dark: '#0E3A2F' },
        amber: { DEFAULT: '#F2A93B', dark: '#F5B957' },
        'amber-ink': { DEFAULT: '#8A4F00', dark: '#F7C878' },
        'amber-soft': { DEFAULT: '#FFF2DB', dark: '#3B2A0C' },
        'rose-ink': { DEFAULT: '#B3263E', dark: '#FF95A6' },
        'rose-soft': { DEFAULT: '#FDEBEE', dark: '#3D1520' },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '18px',
        xl: '28px',
      },
    },
  },
  plugins: [],
};
