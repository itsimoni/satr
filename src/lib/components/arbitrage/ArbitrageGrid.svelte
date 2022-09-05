<script lang="ts">
	// TODO
	// - Hiq dy crypto nga ai array nqs jan njisoj
	// - Mendo per lidhje me cmimin real te X crypto

	export const minimiumValue = 0.001;
	export const maximumValue = 0.0005;

	import { exchanges } from "$lib/stores/exchanges";
	import ArbitrageItem from "$lib/components/arbitrage/ArbitrageItem.svelte";
	import { cryptos } from "$lib/stores/cryptos";
	import { onMount } from "svelte";

	let exchangeInfo = [
		{
			exchange: "",
			exchange2: "",
			value: 0,
			value2: 0,
			coinIndex: 0,
		},
	];

	function randomIntFromInterval(
		min: number,
		max: number,
		decimalPlaces: number
	) {
		var rand =
			Math.random() < 0.5
				? (1 - Math.random()) * (max - min) + min
				: Math.random() * (max - min) + min; // could be min or max or anything in between
		var power = Math.pow(10, decimalPlaces);

		return Math.floor(rand * power) / power;
	}

	function getExchanges() {
		let exchange = exchanges[Math.floor(Math.random() * exchanges.length)];
		let exchange2 = exchanges[Math.floor(Math.random() * exchanges.length)];

		while (exchange === exchange2) {
			exchange2 = exchanges[Math.floor(Math.random() * exchanges.length)];
		}
		const firstValue = randomIntFromInterval(minimiumValue, maximumValue, 5);

		const percentageGain = randomIntFromInterval(3, 6, 1);
		let secondValue = (firstValue / 100) * percentageGain;

		secondValue = firstValue + secondValue;
		return {
			exchange: exchange,
			exchange2: exchange2,
			value: firstValue.toFixed(5),
			value2: secondValue.toFixed(5),
			coinIndex: randomIntFromInterval(0, cryptos.length, 0),
		};
	}

	function populateExchangeInfo() {
		for (let i = 0; i < 4; i++) {
			exchangeInfo.push(getExchanges());
		}
		// for (let e)
	}

	onMount(() => {
		exchangeInfo = [];
		populateExchangeInfo();
	});

	populateExchangeInfo();
	setInterval(() => {
		ready = false;
		exchangeInfo = [];
		populateExchangeInfo();
		ready = true;
	}, 120000);
	let ready = true;
</script>

{#if exchangeInfo.length > 3}
	{#key ready}
		{#each exchangeInfo as ex, i}
			<ArbitrageItem
				symbol={cryptos[ex.coinIndex].symbol}
				exchange={ex.exchange}
				exchange2={ex.exchange2}
				value={ex.value}
				value2={ex.value2}
			>
				<svelte:component
					this={cryptos[ex.coinIndex].icon}
					variation={"white"}
					class="h-5 w-5 lg:h-6 lg:w-6"
				/>
				<p class="text-xs text-white">{cryptos[ex.coinIndex].name}</p>
			</ArbitrageItem>
		{/each}
	{/key}
{/if}
