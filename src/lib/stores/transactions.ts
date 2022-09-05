import supabase from "$lib/db";
import { writable } from "svelte/store";

export const trades = [
	// {
	// 	tId: "Solana",
	// 	details: "Arbitrage - Asset: Solana",
	// 	amount: 250,
	// 	remainingBalance: 250,
	// 	time: "16/06/22",
	// },
];

export let withdrawHistory = [
	{
		tId: "Bitcoin",
		details: "Withdraw through Bitcoin",
		amount: 1500,
		remainingBalance: 250,
		time: "17/06/22",
	},
];

export let transactions = [
	// {
	// 	tId: "Deposit",
	// 	details: "Deposit via Ethereum",
	// 	amount: 250,
	// 	remainingBalance: 750,
	// 	time: "16/06/22",
	// },
	// {
	// 	tId: "Deposit",
	// 	details: "Deposit via Ethereum",
	// 	amount: 500,
	// 	remainingBalance: 250,
	// 	time: "16/06/22",
	// },
];

export const loadTrades = async () => {
	const userId = supabase.auth.user();

	const { data, error } = await supabase
		.from("TradeHistory")
		.select()
		.eq("uuid", userId?.id)
		.order("tId", { ascending: false });

	if (error) {
		console.error(error);
	}

	if (data) {
		let i = 1;
		for await (let trade of data) {
			trades.push({
				sl: i,
				tId: trade.tTransaction,
				details: trade.tDetails,
				amount: trade.tAmount,
				remainingBalance: trade.tRemainingBalance,
				time: trade.tDate,
			});
			i += 1;
		}
	}
	return trades;
};

export const loadDeposits = async (uuid: any) => {
	const { data, error } = await supabase
		.from("Deposits")
		.select()
		.eq("uuid", uuid)
		.order("dId", { ascending: false });

	if (error) {
		console.error(error);
	}
	return data;
};

export const loadTransactions = async () => {
	transactions = [];
	const userId = supabase.auth.user();

	const transactionsDB = await loadDeposits(userId?.id);

	if (transactionsDB) {
		let i = 1;

		for await (let transaction of transactionsDB) {
			transactions.push({
				sl: i,
				details: transaction.dDetails,
				amount: transaction.dAmount,
				time: Date.parse(transaction.created_at),
				confirmed: transaction.dConfirmed
			});
			i += 1;
		}
	}
	return transactions;
};

export const loadWithdrawals = async (uuid: any) => {
	const { data, error } = await supabase
		.from("Withdraw")
		.select()
		.eq("uuid", uuid)
		.order("wId", { ascending: false });


	if (error) {
		console.error(error);
	}
	return data;
};

export const loadWithdrawHistory = async () => {
	withdrawHistory = [];
	const userId = supabase.auth.user();

	const withdrawsDB = await loadWithdrawals(userId?.id);

	if (withdrawsDB) {
		let i = 1;

		for await (let withdraw of withdrawsDB) {
			withdrawHistory.push({
				sl: i,
				details: withdraw.wType,
				amount: withdraw.wAmount,
				confirmed: withdraw.wConfirmed,
				time: Date.parse(withdraw.created_at),
				symbol : withdraw.wCrypto
				// status: 
			});
			i += 1;
		}
	}
	return;
};

// withdraws = await loadWithdrawals(userId?.id);

// async function pushTrades(data: any) {
// 	for (let trade of data) {
// 		trades.push({
// 			tId: trade.tTransaction,
// 			details: trade.tDetails,
// 			amount: trade.tAmount,
// 			remainingBalance: trade.tRemainingBalance,
// 			time: trade.tDate,
// 		});
// 	}
// }
