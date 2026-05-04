/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['PlusJakartaSans'],
        'jakarta-medium': ['PlusJakartaSansMedium'],
        'jakarta-semibold': ['PlusJakartaSansSemiBold'],
        'jakarta-bold': ['PlusJakartaSansBold'],
        'jakarta-extrabold': ['PlusJakartaSansExtraBold'],
      },
    },
  },
  plugins: [],
};
