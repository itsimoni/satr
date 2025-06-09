import { browser } from "$app/env";
import supabase from "$lib/db";
import { invested } from "$lib/stores/store";
import Srand from "seeded-rand";
import { onMount } from "svelte";

export let percMin: any = 1;
export let percMax: any = 1;

export function toFixedNr(num: any, fixed = 0) {
	var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
	return num.toString().match(re)[0];
}

function toFixedFloat(num: any, fixed = 0) {
	return parseFloat(toFixedNr(num, fixed));
}

let daysInMS = 86400000;
let operationsShouldBe = 720;
let userCreationTime: number;
let operationsAtCurrentTime = 0;
let percFinished = 0;

const userId = supabase.auth.user();
const utcDay = new Date().getUTCDay();

if (userId) {
	userCreationTime = Date.parse(userId?.created_at);
}

let investedAmount = 0;

export async function calculateDailyPerc(inv: number) {
  const percentages = await getDailyArbitragePerc(inv);

  if (percentages !== undefined) {
    const rnd = new Srand();
    rnd.seed(utcDay);
    const dailyPerc = rnd.inRange(percentages.percMin, percentages.percMax);

    return calculateMargin(dailyPerc);
  }
}


export async function calculateMargin(dailyPerc = 1.45) {
  const currentDate = new Date().getTime();
  const last12Am = new Date(new Date().setUTCHours(0, 0, 0, 0)).getTime();

  let timeFromToday;

  if (userCreationTime > last12Am) {
    timeFromToday = currentDate - userCreationTime;
  }

  if (userCreationTime < last12Am) {
    timeFromToday = currentDate - last12Am;
  }

  if (timeFromToday > 0) {
    operationsAtCurrentTime = toFixedNr((timeFromToday % daysInMS) / 120000);

    percFinished = toFixedNr((operationsAtCurrentTime / operationsShouldBe) * 100, 2);

    return toFixedNr((dailyPerc / 100) * percFinished, 3);
  }
}


export function msToTime(duration: number) {
	var seconds: any = Math.floor((duration / 1000) % 60),
		minutes: any = Math.floor((duration / (1000 * 60)) % 60),
		hours: any = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = hours < 10 ? "0" + hours : hours;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;

	return hours + ":" + minutes + ":" + seconds;
}

export const getDailyArbitragePerc = async (amount: number) => {
  let percMin, percMax; // Define these variables

  const userId = supabase.auth.user();
  const { data, error } = await supabase
    .from("UserDetails")
    .select("udCustomMaxBotWinning, udCustomMinBotWinning, udBalance")
    .eq("uuid", userId?.id)
    .single();

  if (data) {
    if (
      data.udCustomMaxBotWinning !== null &&
      data.udCustomMinBotWinning !== null
    ) {
      return { percMin: data.udCustomMinBotWinning, percMax: data.udCustomMaxBotWinning };
    }

    // Add a check for udBalance here
    if (data.udBalance !== null && data.udBalance !== undefined) {
      if (data.udBalance < 0.01) {
        percMin = 0.2;
        percMax = 0.5;
      }
      investmentOptions.filter((investment) => {
        if (data.udBalance >= investment.amount) {
          percMin = investment.percMin;
          percMax = investment.percMax;
        }
      });
    }
  }

  if (percMin !== undefined && percMax !== undefined) {
    return { percMin, percMax };
  }
};


export const calculateDailyPercentage = async (amountBTC: number) => {
	let userDailyArbitragePerc = undefined;
	const userId = supabase.auth.user();
	const { data, error } = await supabase
		.from("UserDetails")
		.select("udCustomMaxBotWinning, udCustomMinBotWinning, udBalance")
		.eq("uuid", userId?.id)
		.single();

	if (await data) {
		if (
			(await data.udCustomMaxBotWinning) !== null &&
			(await data.udCustomMinBotWinning) !== null
		) {
			userDailyArbitragePerc = {
				percMin: data.udCustomMinBotWinning,
				percMax: data.udCustomMaxBotWinning,
			};
		}

		if (
			(await data.udCustomMaxBotWinning) === null &&
			(await data.udCustomMinBotWinning) === null
		) {
			await calculateConversionRate();
			if (conversionRate !== 0) {
				if (data && data.udBalance < 0.01) {
					userDailyArbitragePerc = {
						percMin: 0.2,
						percMax: 0.5,
					};
					return userDailyArbitragePerc;
				}
				investmentOptions.filter((investment) => {
					if (data.udBalance >= investment.amount) {
						userDailyArbitragePerc = {
							percMin: investment.percMin,
							percMax: investment.percMax,
						};
					}
				});
			}
		}
	}
	if (userDailyArbitragePerc !== undefined) return userDailyArbitragePerc;
};

export const calculateDailyMargin = async (amountBTC: number) => {
	let userDailyArbitragePerc = undefined;
	const userId = supabase.auth.user();
	const { data, error } = await supabase
		.from("UserDetails")
		.select("udCustomMaxBotWinning, udCustomMinBotWinning, udBalance")
		.eq("uuid", userId?.id)
		.single();

	if (await data) {
		if (
			(await data.udCustomMaxBotWinning) !== null &&
			(await data.udCustomMinBotWinning) !== null
		) {
			return {
				percMin: data.udCustomMinBotWinning,
				percMax: data.udCustomMaxBotWinning,
			};
		}

		if (
			(await data.udCustomMaxBotWinning) === null &&
			(await data.udCustomMinBotWinning) === null
		) {
			await calculateConversionRate();
			if (conversionRate !== 0) {
				if (data && data.udBalance < 0.01) {
					return {
						percMin: 0.2,
						percMax: 0.5,
					};
				}
				investmentOptions.filter((investment) => {
					if (data.udBalance >= investment.amount) {
						return {
							percMin: investment.percMin,
							percMax: investment.percMax,
						};
					}
				});
			}
		}
	}
};

let investmentOptions = [
	{
			percMin: 0.2,
			percMax: 0.5,
			amount: 0.01,	
		},
		{
			percMin: 0.35,
			percMax: 0.7,
			amount: 0.1,
		},
		{
			percMin: 0.6,
			percMax: 1,
			amount: 1,		
		},
		{
			percMin: 0.8,
			percMax: 1.3,
			amount: 5,
		},
		{
			percMin: 1.2,
			percMax: 2.6,
			amount: 10,
		},
		{
			percMin: 2.1,
			percMax: 4.2,
			amount: 50,
		},
];

async function calculateConversionRate() {
	fetch(`https://blockchain.info/tobtc?currency=EUR&value=1`)
		.then((response) => response.json())
		.then((response) => {
			conversionRate = response;
		});
}

let conversionRate = 0;
