import { writable } from "svelte/store";

export let activePair = writable('ETHBTC')

export let pairs = writable([
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "LTC/BTC",
		last: 0.003101,
		change: -1.781,
	},
	{
		name: "BNB/BTC",
		last: 0.0009125,
		change: 4.334,
	},
	{
		name: "NEO/BTC",
		last: 0.001087,
		change: -1.984,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "BTC/EUR",
		last: 32830,
		change: 0.049,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
	{
		name: "ETH/BTC",
		last: 0.007532,
		change: 0.037,
	},
]);

export let bidsBook = writable([
	{
		price: 0.059810,
		amount: 0.8474,
		timestamp: `13:01:18`,
	},
	{
		price: 0.062980,
		amount: 0.8474,
		timestamp: `13:12:18`,
	},
	{
		price: 0.059620,
		amount: 0.8474,
		timestamp: `13:01:18`,
	},
	{
		price: 0.062980,
		amount: 0.8474,
		timestamp: `13:12:18`,
	},
	{
		price: 0.059620,
		amount: 0.8474,
		timestamp: `13:02:18`,
	},
	{
		price: 0.056280,
		amount: 0.8474,
		timestamp: `13:02:18`,
	},
	{
		price: 0.056280,
		amount: 0.8474,
		timestamp: `13:01:18`,
	},
	{
		price: 0.056280,
		amount: 0.8474,
		timestamp: `13:01:18`,
	},
	{
		price: 0.056280,
		amount: 0.8474,
		timestamp: `13:01:18`,
	},
	{
		price: 0.056280,
		amount: 0.8474,
		timestamp: `13:01:18`,
	},
	{
		price: 0.056280,
		amount: 0.8474,
		timestamp: `13:01:18`,
	},
	{
		price: 0.056280,
		amount: 0.8474,
		timestamp: `13:01:18`,
	},
])


export let asksBook = writable([
	{
		price: 0.05980,
		amount: 0.8474,
		timestamp: `13:02:18`,
	},
	{
		price: 0.05980,
		amount: 0.8474,
		timestamp: `13:02:18`,
	},
	{
		price: 0.05980,
		amount: 0.8474,
		timestamp: `13:02:18`,
	},
	{
		price: 0.05980,
		amount: 0.8474,
		timestamp: `13:02:18`,
	},
	{
		price: 0.05980,
		amount: 0.8474,
		timestamp: `13:02:18`,
	},
	{
		price: 0.05980,
		amount: 0.8474,
		timestamp: `13:02:18`,
	},
	{
		price: 0.05980,
		amount: 0.8474,
		timestamp: `13:02:18`,
	},
	{
		price: 0.05980,
		amount: 0.8474,
		timestamp: `13:02:18`,
	},
	{
		price: 0.05980,
		amount: 0.8474,
		timestamp: `13:02:18`,
	},
	{
		price: 0.05980,
		amount: 0.8474,
		timestamp: `13:02:18`,
	},
	{
		price: 0.05980,
		amount: 0.8474,
		timestamp: `13:02:18`,
	},
	{
		price: 0.05980,
		amount: 0.8474,
		timestamp: `13:02:18`,
	},
	{
		price: 0.05980,
		amount: 0.8474,
		timestamp: `13:02:18`,
	},
	{
		price: 0.05980,
		amount: 0.8474,
		timestamp: `13:02:18`,
	},
	{
		price: 0.05980,
		amount: 0.8474,
		timestamp: `13:02:18`,
	},
])
