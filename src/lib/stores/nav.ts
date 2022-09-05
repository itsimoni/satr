import { writable } from "svelte/store";

export let nav = writable({
	trade: '/',
	bot: '/arbitrage',
	transactions: '/ledger/transactions',
	tradeHistory: '/ledger/tradehistory',
	depositHistory: '/funding/deposithistory',
	deposit: '/funding/deposit',
	withdraw: '/funding/withdraw',
	withdrawHistory: '/funding/withdrawhistory',
	account: '/account/user',
	reset: '/account/reset',
	thankyou: '/thankyou',
	earn: '/arbitrage/earn',
	terms: '#',
	recovery: '/recovery',
	registration: '/register',
	login: '/login'
})

export let pageOpened = writable(false);