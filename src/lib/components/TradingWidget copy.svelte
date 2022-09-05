<script lang="ts">
	import { pageOpened } from "$lib/stores/nav";
	const SCRIPT_ID = "tradingview-widget-script";

	import { activePair } from "$lib/stores/pairs";
	import { t, locale, locales } from "$lib/services/i18n";

	import TradingViewWidget from "svelte-tradingview-widget";
	import { onMount } from "svelte";
	import { browser } from "$app/env";
	import { destroy_component } from "svelte/internal";

	let options = {
		symbol: $activePair,
		theme: "dark",
		autosize: true,
		locale: $locale,
		toolbar_bg: "#00FF22",
		withdateranges: true,
		allow_symbol_change: true,
		interval: "60",
	};

	let active = "BNB/BTC";
	let ready = false;
	$: active = $activePair;
	let widget;

	async function addWidget() {
		if (browser) {
			document.getElementById("trading-view").innerHTML = "";
			// var script = document.createElement("script");
			// script.setAttribute(
			// 	"src",
			// 	"https://s3.tradingview.com/tv.js"
			// );
			// script.text = options;

			// --
			// 			const script = document.createElement("script");
			// 			script.src = "https://s3.tradingview.com/tv.js";
			// 			script.type = "text/javascript";
			// 			script.async = true;
			// 			script.text = `{
			// 				'width': '100%',
			// 				'height': '100%',
			// 				'symbol': 'BTCEUR',
			// 				'locale': 'en',
			// 				'theme': 'white',
			// 				'interval': '1D'
			// 			}`;
			// --

			// script.text =
			// 	"{" +
			// 	'"width": "100%",' +
			// 	'"height": "100%",' +
			// 	'"symbol": "' +
			// 	$activePair +
			// 	'",' +
			// 	'"locale": "en",' +
			// 	'"interval": "1D"' +
			// 	"}";
			// ready = true;
			// document.getElementById("trading-view").appendChild(script);

			// 			script.text = `{
			// 	'width': '100%',
			// 	'height': '100%',
			// 	'symbol': '${$activePair}',
			// 	'locale': '${$locale}',
			// 	'interval': '1D'
			// }`;
		}
	}

	onMount(() => {
		addWidget();
	});

	async function refreshDocument() {
		if (browser) {
			let element = document.getElementById("trading-view");
			while (element.firstChild) {
				element.removeChild(element.firstChild);
			}
		}
		addWidget();
		console.log("should update here");
		console.log($activePair);
	}

	$: $activePair, refreshDocument();
</script>

<TradingViewWidget {options} />
