<script lang="ts">
	import { t, locale, locales } from "$lib/services/i18n";
	export let active = "BNB/BTC";
	export let loc: string;
	import { browser } from "$app/env";

	import TradingViewWidget from "svelte-tradingview-widget";
	import { onMount } from "svelte";

	let options = {
		symbol: active,
		theme: "dark",
		autosize: true,
		locale: loc,
		toolbar_bg: "#00FF22",
		withdateranges: true,
		allow_symbol_change: true,
		interval: "60",
	};

	// async function addWidget() {
	// 	console.log("should create widget here");
	// 	if (browser) {
	// 		let script = document.createElement("script");
	// 		script.type = "text/javascript";
	// 		script.setAttribute("src", "https://s3.tradingview.com/tv.js");
	// 		script.text =
	// 			"{" +
	// 			'"width": "100%",' +
	// 			'"height": "100%",' +
	// 			'"symbol": "' +
	// 			active +
	// 			'",' +
	// 			'"locale": "en",' +
	// 			'"interval": "1D"' +
	// 			"}";
	// 		document.getElementById("trading-view");
	// 	}
	// }

	// onMount(() => {
	// 	addWidget();
	// });

	// new TradingView.widget({
	// 	container_id: "technical-analysis",
	// 	width: 600,
	// 	height: 600,
	// 	symbol: symbol,
	// 	interval: "D",
	// 	timezone: "exchange",
	// 	theme: "White",
	// 	style: "1",
	// 	toolbar_bg: "#f1f3f6",
	// 	withdateranges: true,
	// 	hide_side_toolbar: false,
	// 	allow_symbol_change: true,
	// 	save_image: false,
	// 	hideideas: true,
	// 	studies: [
	// 		"ROC@tv-basicstudies",
	// 		"StochasticRSI@tv-basicstudies",
	// 		"MASimple@tv-basicstudies",
	// 	],
	// 	show_popup_button: true,
	// 	popup_width: "1000",
	// 	popup_height: "650",
	// });
</script>

<TradingViewWidget {options} />

<!-- TradingView Widget BEGIN -->

