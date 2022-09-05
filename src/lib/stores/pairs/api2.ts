export const apiCryptos = [
	{ symbol: "BTC", value: 0, change: 0, primary: true },
	{ symbol: "ETH", value: 0, change: 0, primary: true },
	{ symbol: "USDT", value: 0, change: 0, primary: true },
	{ symbol: "XRP", value: 0, change: 0, primary: true },
	{ symbol: "BCH", value: 0, change: 0, primary: true },
	{ symbol: "XLM", value: 0, change: 0, primary: true },

	{ symbol: "SOL", value: 0, change: 0, primary: false },
	{ symbol: "FTT", value: 0, change: 0, primary: false },
	{ symbol: "ADA", value: 0, change: 0, primary: false },
	{ symbol: "DOT", value: 0, change: 0, primary: false },
	{ symbol: "AVAX", value: 0, change: 0, primary: false },
	{ symbol: "LTC", value: 0, change: 0, primary: false },
	{ symbol: "CELO", value: 0, change: 0, primary: false },
	{ symbol: "WBTC", value: 0, change: 0, primary: false },
	{ symbol: "MKR", value: 0, change: 0, primary: false },
	{ symbol: "AXS", value: 0, change: 0, primary: false },
	{ symbol: "LINK", value: 0, change: 0, primary: false },
	{ symbol: "BCHSV", value: 0, change: 0, primary: false },
	{ symbol: "ALGO", value: 0, change: 0, primary: false },
	{ symbol: "ATOM", value: 0, change: 0, primary: false },
	{ symbol: "AAVE", value: 0, change: 0, primary: false },
	{ symbol: "MATIC", value: 0, change: 0, primary: false },
	{ symbol: "XMR", value: 0, change: 0, primary: false },
	{ symbol: "ENJ", value: 0, change: 0, primary: false },
	{ symbol: "ETC", value: 0, change: 0, primary: false },
	{ symbol: "TRX", value: 0, change: 0, primary: false },
	{ symbol: "LEO", value: 0, change: 0, primary: false },
	{ symbol: "BNB", value: 0, change: 0, primary: false },
];

let apiPairs = [];

let dataPromise;

function calculatePriceYesterday(value: number, perc: number) {
	let cryptoValueAfterPercChange = (value / 100) * perc;

	if (perc < 0) cryptoValueAfterPercChange = value + cryptoValueAfterPercChange;
	if (perc > 0) cryptoValueAfterPercChange = value - cryptoValueAfterPercChange;

	return cryptoValueAfterPercChange;
}

function calculateChange(
	otherCryptoSymbol: string,
	symbol: string,
	crypto1: number,
	perc: number,
	crypto2: number,
	perc2: number
) {
	if (symbol == "USDT") {
		return perc;
	}
	if (otherCryptoSymbol == "USDT") {
		return perc2 * -1;
	}
	let priceToday = crypto1 / crypto2;
	let priceYesterday =
		calculatePriceYesterday(crypto1, perc) /
		calculatePriceYesterday(crypto2, perc2);
	let priceDifference = priceToday - priceYesterday;
	const unfinishedPercCalculation = priceDifference / priceYesterday;

	return unfinishedPercCalculation * 100;
}
export const fetchData = async (symbol: string) => {
	const response = fetch(`https://api.coinlore.net/api/tickers/`);
	apiPairs = [];
	const data = (await response).json();
	dataPromise = await data;

	for (let crypto of apiCryptos) {
		crypto.value = crypto.value * 0.96;
		let responseLength = Object.keys(dataPromise.data).length;
		for (let i = 0; i < responseLength; i++) {
			if (dataPromise.data[i].symbol === crypto.symbol) {
				crypto.value = dataPromise.data[i].price_usd;
				crypto.change = dataPromise.data[i].percent_change_24h;
			}
		}
	}
	for (let crypto of apiCryptos) {
		if (crypto.symbol === symbol) {
			for (let otherCrypto of apiCryptos) {
				if (otherCrypto.symbol == crypto.symbol) continue;

				apiPairs.push({
					symbol: `${otherCrypto.symbol}/${crypto.symbol}`,
					value: otherCrypto.value / crypto.value,
					change: calculateChange(
						otherCrypto.symbol,
						crypto.symbol,
						parseFloat(otherCrypto.value),
						parseFloat(otherCrypto.change),
						parseFloat(crypto.value),
						parseFloat(crypto.change)
					),
					primary: false,
				});
			}
		}
	}
	return apiPairs;
};

export const createPairs = async (symbol: string, search: string) => {
	const newCryptos = fetchData(symbol);
	if (search !== "") {
		let filteredNewCryptos = [];
		filteredNewCryptos = (await newCryptos).filter((crypto) => {
			if (crypto.symbol.toLowerCase().includes(search.toLowerCase())) {
				return crypto;
			}
		});
		return filteredNewCryptos;
	}
	return newCryptos;
};
