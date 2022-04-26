module.exports = {
  prefix: "nf-",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: "rgb(58, 120, 18)",
      white: "rgb(255,255,255)",
      black: "rgb(0,0,0)",
    },
    fontFamily: {
      Inter: ["Inter", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
};
