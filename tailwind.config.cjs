module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				inter: "Inter, sans-serif",
			},
			colors: {
				main: "#fff",
				loss: '#EF5350',
				gain: '#26A67F',
				lossHover: '#FA5753',
				gainHover: '#2AB58A',
				lossActive: '#E6504D',
				gainActive: '#249C77',
				gold: '#E2AF11',

				mainbg: '#131722',
				secondarybg: '#242733',
				white: '#E4E5E8',
				borderColor: '#363C4E'
			}
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require("@tailwindcss/forms")
	],
};