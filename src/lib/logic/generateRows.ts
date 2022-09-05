import supabase from "$lib/db";
import { cryptos } from "$lib/stores/cryptos";
import { invested } from "$lib/stores/store";
let coin = "btc";
let amount = 1;
let investedAmount = 0;

invested.subscribe((inv) => (investedAmount = inv));

export const minimiumValue = (0.002 * investedAmount) / 10;
export const maximumValue = (0.003 * investedAmount) / 10;

function randomIntFromInterval(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randCoin() {
	let generatedIndex = randomIntFromInterval(0, cryptos.length);
	if (generatedIndex == cryptos.length) {
		generatedIndex = generatedIndex - 1;
	}
	if (generatedIndex == -1) {
		generatedIndex = generatedIndex + 1;
	}
	return cryptos[generatedIndex].name;
}

export const GenerateRows = async (rowsToInsert: number) => {
	for (let i = 0; i < rowsToInsert; i++) {
		const amountGenerated = (
			Math.random() * (maximumValue - minimiumValue) +
			minimiumValue
		).toFixed(5);
		const coinName = randCoin();
		const userId = supabase.auth.user();
		if (userId?.id !== null) {
			const { data, error } = await supabase.from("TradeHistory").insert([
				{
					tTransaction: coinName,
					tDetails: `Arbitrage - Asset: ${coinName}`,
					tAmount: amountGenerated,
					tRemainingBalance: investedAmount - amountGenerated,

					uuid: userId?.id,
					tEmail: userId?.email,

					isDay: false,
				},
			]);
			if (error) {
				console.error(error);
			}
		}
	}
};

export const GenerateTransaction = async (coinName, amount) => {
	const userId = supabase.auth.user();
	const { data, error } = await supabase.from("Deposits").insert([
		{
			tTransaction: coinName,
			dDetails: `Deposit via ${coinName}`,
			tAmount: amount,
			tRemainingBalance: investedAmount,
			uuid: userId?.id,
			dEmail: userId?.email,

			isDay: false,
		},
	]);
	if (error) {
		console.error(error);
	}
};

export const GenerateWinningsRows = async (
	newUserBalance: number,
	userBalance: number
) => {
	const userId = supabase.auth.user();
	const { data, error } = await supabase.from("TradeHistory").insert([
		{
			tTransaction: "Arbitrage Winnings",
			tDetails: `Daily Balance Update`,
			tAmount: newUserBalance - userBalance,
			tRemainingBalance: newUserBalance,
			uuid: userId?.id,
			tEmail: userId?.email,
			isDay: true,
		},
	]);
};
