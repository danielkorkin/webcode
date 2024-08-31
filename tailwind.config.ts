// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"vs-bg": "#FFFFFE", // Light theme background
				"vs-dark-bg": "#1E1E1E", // Dark theme background
				"vs-text": "#000000", // Light theme text
				"vs-dark-text": "#D4D4D4", // Dark theme text
				"code-gray": "#1E1E1E", // Your custom color for dark theme
				"code-black": "#040404",
				"code-grack": "#111111",
			},
		},
	},
	plugins: [],
};
export default config;
