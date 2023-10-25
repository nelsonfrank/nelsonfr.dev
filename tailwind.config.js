module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		fontFamily: {
			Inter: ["Inter", "sans-serif"],
		},
		screen: {
			tablet: "960px",
			desktop: "1248px",
		},
		extend: {
			colors: {
				primary: "rgb(58, 120, 18)",
				white: "rgb(255,255,255)",
				black: "rgb(0,0,0)",
				"gray-light": "#D3D3D3",
				gray: "rgb(128,128,128)",
			},
			gridTemplateColumns: {
				"card-lists": "repeat(auto-fit, minmax(300px, 1fr))",
			},
			spacing: {
				"56.25%": "56.25%",
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
