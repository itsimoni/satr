<script lang="ts">
	import { browser } from "$app/env";
	import { locale } from "$lib/services/i18n";
	import { activePair } from "$lib/stores/pairs";

	import { onMount } from "svelte";
	// export let options = Object;
	let options = {
		symbol: $activePair,
		theme: "dark",
		autosize: true,
		locale: $locale,
		toolbar_bg: "#00FF22",
		withdateranges: true,
		allow_symbol_change: true,
		interval: "60",
		"hide_side_toolbar": false,

		studies: [
			"StochasticRSI@tv-basicstudies",
		]
	};
	const SCRIPT_ID = "tradingview-widget-script";
	let CONTAINER_ID = "";

	onMount(() => {
		CONTAINER_ID = options && options.container_id ? options.container_id : "svelte-tradingview-widget";

		appendScript(initWidget);
	});

	function initWidget() {
		if (typeof TradingView !== "undefined") {
			new window.TradingView.widget(
				Object.assign({ container_id: CONTAINER_ID }, options)
			);
		}
	}

	function appendScript(onload) {
		if (document.getElementById(SCRIPT_ID) === null) {
			const script = document.createElement("script");
			script.id = SCRIPT_ID;
			script.type = "text/javascript";
			script.async = true;
			script.src = "https://s3.tradingview.com/tv.js";
			script.onload = onload;
			document.getElementsByTagName("head")[0].appendChild(script);
		} else {
			const script = document.getElementById(SCRIPT_ID);
			const oldOnload = script.onload;
			return (script.onload = () => {
				oldOnload();
				onload();
			});
		}
	}

	function updateWidget() {
		if (browser) {
			initWidget();
		}
	}

	// $: active, if (browser) {
	// 	appendScript(initWidget)
	// }
	$: autosize = options.autosize;
	$: options.symbol = $activePair.replace('/', '')
	$: $activePair, updateWidget();
</script>

<div id={CONTAINER_ID} class:autosize />

<style>
	.autosize {
		width: 100%;
		height: 100%;
		background-color: #131722;
	}
</style>
