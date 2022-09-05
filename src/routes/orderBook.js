// @ts-nocheck
let bids = []
let asks = []

export const get = async (request) => {

	const object_query = {};
	for (const [key, value] of request.url.searchParams) {
		object_query[key] = value;
	}
	const url = `https://api.binance.com/api/v3/depth?limit=10&symbol=${object_query.symbol}`

	const response = await fetch(url);
	if (await response.ok === false) {
		return {
			body: {
				bids: ['Unavailable', 'Unavailable', 'Unavailable'],
				asks: ['Unavailable', 'Unavailable', 'Unavailable']
			}
		}
	}
	const data = await response.json();

	bids = await data.bids;
	asks = await data.asks;

	return {
		body: {
			bids: await bids,
			asks: await asks
		}
	}
}
