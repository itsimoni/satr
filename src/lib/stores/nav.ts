import { writable } from "svelte/store";

export let nav = writable({
	trade: '/',
	bot: '/arbitrage',
	transactions: '/ledger/transactions',
	stakeHistory: '/ledger/stakehistory',
	tradeHistory: '/ledger/tradehistory',
	depositHistory: '/funding/deposithistory',
	deposit: '/funding/deposit',
	withdraw: '/funding/withdraw',
	staking: '/funding/staking',
	withdrawHistory: '/funding/withdrawhistory',
	account: '/account/user',
	reset: '/account/reset',
	referal: '/account/referal',
	thankyou: '/thankyou',
	earn: '/arbitrage/earn',
	terms: '#',
	recovery: '/recovery',
	registration: '/register',
	login: '/login'
})

export let pageOpened = writable(false);