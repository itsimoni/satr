<script>
	import { apiCryptos } from "$lib/stores/pairs/api2";
	let dataPromise;

	export const fetchData = async () => {
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
		return data;
	};
</script>
