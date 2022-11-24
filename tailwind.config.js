module.exports = {
  prefix: "nf-",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      Inter: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "rgb(58, 120, 18)",
        white: "rgb(255,255,255)",
        black: "rgb(0,0,0)",
        "gray-light": "rgb(169,169,169)",
        gray: "#D3D3D3",
      },
      gridTemplateColumns: {
        "card-lists": "repeat(auto-fit, minmax(300px, 1fr))",
      },
    },
  },
  plugins: [],
};
