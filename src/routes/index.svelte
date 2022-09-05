<script lang="ts">
	import { t } from "$lib/services/i18n";
	import PairsLeft from "$lib/components/PairsLeft.svelte";
	import PairsRight from "$lib/components/PairsRight.svelte";
	import { Svrollbar } from "svrollbar";
	import { companyName, invested, current, userName } from "$lib/stores/store";
	import { browser } from "$app/env";
	import EmbededTradingViewWidget from "$lib/components/EmbededTradingViewWidget.svelte";
	import { nav } from "$lib/stores/nav";
	import { onMount } from "svelte";
	import { widgetReady } from "$lib/stores/widgetReady";
import Logo from "$lib/Logo.svelte";
import Footer from "$lib/components/Footer.svelte";
	let searchInput: string;
	export let widgetFullscreen = false;

	// export async function refreshDocument(symbol) {
	// 	if (browser) {
	// 		let element = document.getElementById("tradingViewWidget");
	// 		while (element.firstChild) {
	// 			element.removeChild(element.firstChild);
	// 		}
	// 	}
	// 	addWidget(symbol);
	// }

	function openFullscreen() {
		widgetFullscreen = !widgetFullscreen;
	}
</script>

<title>Trade - {$companyName}</title>

<div
	class="relative flex h-full w-full flex-col bg-mainbg pb-2 font-inter lg:flex-row"
>
	<PairsLeft />
	<div class="border-borderColor bg-mainbg p-2 py-2 lg:w-2/4 lg:border-r">
		<div
			class="lg:tradingViewWidgetDesktop my-1 h-72 w-full border-b border-borderColor
				{!widgetFullscreen
				? 'lg:my-0 lg:h-[80vh]'
				: 'fixed top-0 right-0 z-20 flex h-screen w-screen flex-col items-center justify-center px-10 py-8'} 
				"
			id="tradingViewWidget"
		>
			{#if $widgetReady}
				<EmbededTradingViewWidget />
			{/if}
			{#if widgetFullscreen}
				<div class="mt-2 flex w-full flex-col items-center justify-center">
					<button
						on:click={openFullscreen}
						class="buttonSmall w-full text-white">{$t("returnCTA")}</button
					>
					<Logo classNames="mt-6 h-3"></Logo>
				</div>
			{/if}
		</div>
		<div
			class="mt-2 hidden w-full items-center justify-between space-x-2 border border-borderColor bg-mainbg py-2 px-2 lg:flex"
		>
			<button on:click={openFullscreen} class="buttonBig"
				>{$t("homeButton1")}</button
			>
			<!-- svelte-ignore a11y-invalid-attribute -->
			<a href={$nav.bot} class="buttonBigSecondary  text-center"
				>{$t("investCTA")}</a
			>
		</div>
	</div>
	<PairsRight />
</div>

<div class="mx-2  hidden h-[1px] w-full bg-borderColor lg:block" />
<Footer></Footer>

<style>
	:global(body) {
		background-color: #131722;
	}

	#tradingViewWidget {
		background-color: #131722;
	}

	.tradingViewWidgetDesktop {
		width: calc(50vw - 1rem);
	}
</style>
