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
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
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
