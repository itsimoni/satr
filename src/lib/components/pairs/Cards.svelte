<script>
	import { browser } from "$app/env";

	import Card from "$lib/components/pairs/Card.svelte";
	import { onMount } from "svelte";

	let tickers = {};
	var requestOptions = {
		method: "GET",
		redirect: "follow",
	};
	
	const connectCrypto = async () => {

		fetch("https://api.coincap.io/v2/rates?symbol=eur", requestOptions)
			.then((response) => response.text())
			.then((result) => console.log(result))
			.catch((error) => console.log("error", error));

		const ws = new WebSocket(
			"wss://ws.coincap.io/prices?assets=bitcoin,ethereum,litecoin,maker,dogecoin,stellar,algorand,basic-attention-coin,compound,celo"
		);
		// const ws = new WebSocket("wss://ws.coincap.io/prices?assets=ALL");

		fetch(
			"https://api.coincap.io/v2/assets?ids=bitcoin,ethereum,litecoin,maker,dogecoin,stellar,algorand,basic-attention-coin,compound,celo"
		)
			.then((response) => response.json())
			.then((data) => console.log(data));

		ws.onmessage = (e) => {
			let data = JSON.parse(e.data);
			Object.keys(data).forEach((ticker) => {
				if (!tickers[ticker]) {
					tickers[ticker] = {
						price: parseFloat(data[ticker]),
						direction: "none",
					};
					return;
				}
				let direction = data[ticker] > tickers[ticker].price ? "up" : "down";
				tickers[ticker] = { price: parseFloat(data[ticker]), direction };
			});
		};
	};

	onMount(() => {
		if (browser) {
			connectCrypto();
		}
	});
</script>

<div class="cards">
	{#each Object.entries(tickers) as [name, value]}
		{#if !isNaN(value.price)}
			<Card {name} {value} />
		{/if}
	{/each}
</div>

<style>
	.cards {
		display: flex;
		flex-wrap: wrap;
	}
</style>
