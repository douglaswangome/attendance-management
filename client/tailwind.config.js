/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

export default withMT({
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			boxShadow: {
				round: "0 0 12px ",
			},
			colors: {
				// Primary
				primary: "#407BFF",
				// Light

				// Dark
				dark: "#212121",
				"less-dark": "#424242",
				"lesser-dark": "#727272",
			},
		},
	},
	plugins: [],
});
