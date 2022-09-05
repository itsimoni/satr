import supabase from "$lib/db";
import { loadTrades } from "$lib/stores/transactions";
import { deleteAllRows, deleteRow } from "./deleteRows";
import { GenerateRows, GenerateWinningsRows } from "./generateRows";

// ! Misc
/**
 * Get a random floating point number between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random floating point number
 */
function random(min: number, max: number) {
	return Math.random() * (max - min) + min;
}
export const toFixedNr = (num:any, fixed = 0) => {
	var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
	return num.toString().match(re)[0];
}
function calculateNewNumberPerc(oldNumber: number, decimalNumber: number) {
	return oldNumber + (oldNumber / 100) * decimalNumber;
}
class DivisionAlgorithm {
	divide(n, k) {
		let value = 0;
		while (n > 0) {
			n -= k;
			value++;
		}
		if (n < 0) {
			value--;
		}
		return value;
	}
}
let division = new DivisionAlgorithm();
let daysInMS = 86400000;
let operationsWithinADay = 720;

export const checkTradesQuantityInDB = async (
	currentTimeInUTC: number,
	userCreationInUTC: number,
	last12AmInUTC: number,
	operationsInDB: number,
	operationsListDB: any
) => {
	const operationsShouldBe = await calculateOperationsShouldBe(
		userCreationInUTC,
		last12AmInUTC,
		currentTimeInUTC
	);

	if (operationsShouldBe) {
		if (operationsInDB > operationsShouldBe) {
			let amountToRemove = operationsInDB - operationsShouldBe;

			const amountToRemoveCache = amountToRemove;
			let arrayToRemove = [];

			if (operationsListDB) {
				const operationsOnlyListDB = operationsListDB.filter(
					(op: any) => op.isDay == false
				);
				while (arrayToRemove.length < amountToRemoveCache) {
					arrayToRemove.push(await operationsOnlyListDB[amountToRemove].id);
					amountToRemove -= 1;
				}
				for (let id of arrayToRemove) {
					deleteRow(id);
				}
			}
		}
	}

	if (operationsShouldBe) {
		if (operationsShouldBe > operationsInDB) {
			let amountToAdd = operationsShouldBe - operationsInDB;

			GenerateRows(amountToAdd);
		}
	}

	return true;
};

// * PUNOJNE
const calculateOperationsShouldBe = async (
	userCreation: number,
	last12Am: number,
	currentTime: number
) => {
	let operationsThatShouldBeRightNow = 0;
	let timeFromToday: any;

	if (userCreation > last12Am) {
		timeFromToday = (await currentTime) - (await userCreation);
	}

	if (userCreation < last12Am) {
		timeFromToday = currentTime - last12Am;
	}

	if ((await timeFromToday) > 0) {
		operationsThatShouldBeRightNow = await toFixedNr(
			(timeFromToday % daysInMS) / 120000
		);
		return operationsThatShouldBeRightNow;
	}
};
const fetchUserBalance = async (uuid: any) => {
	const { data, error } = await supabase
		.from("UserDetails")
		.select("udBalance")
		.eq("uuid", uuid)
		.single();

	if (error) console.error("1: ", error);

	return data.udBalance;
};
const updateUserBalance = async (
	uuid: any,
	amount: number,
	userBalance: number
) => {
	if ((await amount) && userBalance) {
		const newUserBalance = calculateNewNumberPerc(userBalance, amount);

		const { data, error } = await supabase
			.from("UserDetails")
			.update({ udBalance: newUserBalance })
			.eq("uuid", uuid);
		if (error) console.error("2: ", error);
		await GenerateWinningsRows(newUserBalance, userBalance);
	}
};
const calculateBotWinnings = async (uuid: any) => {
	const { data, error } = await supabase
		.from("UserDetails")
		.select("udMinBotWinning, udMaxBotWinning")
		.eq("uuid", uuid)
		.single();

	if (error) console.error(error);
	if (await data) {
		if (data.udMinBotWinning) {
			if (data.udMinBotWinning !== null) {
				const dailyWinning = random(
					await data.udMinBotWinning,
					await data.udMaxBotWinning
				);

				return dailyWinning;
			}
		}
	}
	const dailyWinningFallback = random(1.3, 1.4);
	return dailyWinningFallback;
};
const loadAllOperations = async (uuid: any) => {
	const { data, error } = await supabase
		.from("TradeHistory")
		.select()
		.eq("uuid", uuid)
		.match({ isDay: false })
		.order("tId", { ascending: true });

	if (error) {
		// console.error("3: ", error);
		return false;
	}
	interface operations {
		sl: number;
		id: number;
		tId: string;
		isDay: boolean;
		details: string;
		amount: number;
		remainingBalance: number;
		time: number;
	}

	const operations: operations[] = [];
	if (data) {
		let i = 1;
		for await (let trade of data) {
			operations.push({
				sl: i,
				id: trade.tId,
				tId: trade.tTransaction,
				isDay: trade.isDay,
				details: trade.tDetails,
				amount: trade.tAmount,
				remainingBalance: trade.tRemainingBalance,
				time: Date.parse(trade.tDate),
			});
			i += 1;
		}
	}
	return operations;
};
// return 0 if no ops

export const loadMostRecentOp = async (uuid: any) => {
	const { data, error } = await supabase
		.from("TradeHistory")
		.select()
		.eq("uuid", uuid)
		.order("tId", { ascending: false })
		.limit(1)
		.single();

	if (error) return 0;

	if (data) {
		return Date.parse(data.tDate);
	}
};

// ----------------------------------------------------------------------- //
// rregullon operacionet e thjeshta
export const onStart = async () => {
	const user = supabase.auth.user();
	// Misc
	const last12Am = new Date(new Date().setUTCHours(0, 0, 0, 0)).getTime();

	const currentTimeInUTC = new Date().getTime();
	const userCreationTime = Date.parse(user?.created_at);

	// punojn kto
	const operations = await loadAllOperations(user?.id);
	checkTradesQuantityInDB(
		currentTimeInUTC,
		userCreationTime,
		last12Am,
		operations.length,
		operations
	);
};

// rregullon botWinnings
export const checkBotWinnings = async (uuid: any) => {
	let mostRecentOperation: any = 0;
	mostRecentOperation = await loadMostRecentOp(uuid);
	const last12Am = new Date(new Date().setUTCHours(0, 0, 0, 0)).getTime();
	if (mostRecentOperation !== 0 && mostRecentOperation !== undefined) {
		// siguron qe ka ardh operacioni
		if (mostRecentOperation < last12Am) {
			const daysToAdd = division.divide(
				last12Am - mostRecentOperation,
				daysInMS
			);
			return daysToAdd + 1;
		}
	}
	return 0;
};

export const regulateBotWinnings = async (uuid: any, daysToAdd: number) => {
	await deleteAllRows();
	for (let i = 0; i < daysToAdd; i++) {
		const dailyWinPercentageRandomised = await calculateBotWinnings(uuid);
		const userBalance = await fetchUserBalance(uuid);
		updateUserBalance(uuid, dailyWinPercentageRandomised, userBalance);
	}
	return false;
};
