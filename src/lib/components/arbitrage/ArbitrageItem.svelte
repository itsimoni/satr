<script lang="ts">
    let growthPerc = 2.3;
    let growthPercMax = 2.5;
    import PairsArbitrage from "$lib/components/arbitrage/PairsArbitrage.svelte";
    import Radar from "$lib/components/arbitrage/Radar.svelte";
    export let exchange: string = "";
    export let exchange2: string = "";
    export let value = 0;
    export let value2 = 0;
    import { t } from "$lib/services/i18n";

    export let symbol: string = "BTC"; // Ensuring symbol has a default value

    let bids = [];
    let asks = [];

		

    // Function to generate random order values
    function getRandomOrderValue(min, max) {
        return (Math.random() * (max - min) + min).toFixed(5);
    }

    // Function to generate mock order book data
    function generateMockOrderBook() {
        bids = Array.from({ length: 10 }, () => ({
            price: getRandomOrderValue(0.05068, 0.05077),
            amount: getRandomOrderValue(1, 50)
        }));

        asks = Array.from({ length: 10 }, () => ({
            price: getRandomOrderValue(0.05078, 0.05087),
            amount: getRandomOrderValue(1, 50)
        }));

        bids.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        asks.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }

    $: symbol, generateMockOrderBook();
    generateMockOrderBook();

		
</script>

<div
	class="relative my-4 flex min-w-full flex-col justify-between border border-borderColor text-white lg:my-6 lg:flex-row"
>
	<div
		class="flex items-center justify-between pt-8 pb-4 pl-2 lg:w-1/2 lg:py-12 lg:pl-6 lg:pr-2"
	>
		<div
			class="flex flex-col items-center text-left lg:w-8/12 lg:flex-row lg:justify-between lg:pr-4"
		>
			<div class="w-44 lg:pb-6">
				<div class="flex h-6 items-center space-x-2">
					<slot />
				</div>
				<div class="mt-4">
					<p class="text-left text-sm">{$t("cbBuyAt")}</p>
					<p class="text-left text-3xl font-semibold">{exchange}</p>
					<p class="mt-4 text-sm">{$t("cbFor")} {value} BTC</p>
				</div>
			</div>
			<div class="flex w-16 items-center justify-start">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="hidden h-6 w-6 lg:block"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
					/>
				</svg>
			</div>
			<div class="w-44 pb-4 lg:pb-6">
				<div class="h-6" />
				<div class="mt-2">
					<p class="text-left text-sm">{$t("cbSellTo")}</p>
					<p class="text-left text-3xl font-semibold">{exchange2}</p>
					<p class="mt-4 text-sm">{$t("cbFor")} {value2} BTC</p>
				</div>
			</div>
		</div>
		<div class="relative flex w-1/2 opacity-20 sm:opacity-100 md:opacity-100">
			<Radar />
		</div>
	</div>
	 <div class="lg:w-1/2">
        {#key bids}
            <PairsArbitrage {exchange} {exchange2} {bids} {asks} {symbol} />
        {/key}
    </div>
	<div
		class="absolute top-1/2 left-1/2 hidden h-[90%] w-[1px] -translate-x-1/2 -translate-y-1/2 bg-borderColor lg:block"
	/>
</div>

<style>
	#bg {
		background-color: #131722;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='199' viewBox='0 0 100 199'%3E%3Cg fill='%23242733' fill-opacity='1'%3E%3Cpath d='M0 199V0h1v1.99L100 199h-1.12L1 4.22V199H0zM100 2h-.12l-1-2H100v2z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
	}
</style>
