<script lang="ts">
	let dataPromise;
	export let res: any;

	import { apiCryptos } from "$lib/stores/pairs/api2";

	export const fetchData = async () {
		const response = fetch(`https://api.coinlore.net/api/tickers/`);

		const data = (await response).json();
		dataPromise = await data;

		for (let crypto of $apiCryptos) {
			let responseLength = Object.keys(dataPromise.data).length;
			for (let i = 0; i < responseLength; i++) {
				if (dataPromise.data[i].symbol === crypto.symbol) {
					crypto.value = dataPromise.data[i].price_usd;
					crypto.change = dataPromise.data[i].percent_change_24h;
				}
			}
			crypto.value = crypto.value * 0.96;
		}
		return;
	}
</script>

<div class="min-h-screen bg-mainbg text-white">
	<button
		class="mx-auto w-full bg-secondarybg px-8 py-4"
		on:click={() => {
			{
				dataPromise = fetchData();
			}
		}}>Fetch</button
	>
	<!-- 
	{#if dataPromise}
		{#await dataPromise}
			Loading
		{:then data}
			<ul>
				{#each $selectedCrypto as crypto, i}
					<li>
						{crypto.name}
						{crypto.current_price}
					</li>
				{/each}
			</ul>
		{/await}
	{/if}
</div> -->

	{#if dataPromise}
		{#await dataPromise}
			Loading
		{:then data}
			<pre class="overflow-scroll w-[20rem] mx-auto h-96">{JSON.stringify(
					data
				)}</pre>
		{/await}
	{/if}
</div>
