// TODO:
//* - Te kalohet perqindja e humbjet te Min - Max i cryptobotit radaret pr besueshmeri
//* - mendo si do fshihen op para 12-es
//*& CATCH ERROR: Nqs jane shtuar Op me shume sec duhet. Te behen splice nga fundi i array.

import supabase from "$lib/db";

// Misc
function toFixedNr(num, fixed = 0) {
	var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
	return num.toString().match(re)[0];
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
// End

// TODO: Redefine values
let operationsShouldBe = 720;
let currentDate = Date.now();

let last12Am = new Date(new Date().setHours(0, 0, 0, 0)).getTime();

let diteBotiAktiv: number = 0;
let saOpPas12Jane: number = 0;

let botWinningsDB: number = 0;

const timeSinceLastLogin = Date.now() - lastLogin; // Ne ms
const daysPassed = division.divide(timeSinceLastLogin, daysInMS); // GJEJ SA DITE KANE KALUAR (mund te nxjerri dhe 0)
const minutesLeft = timeSinceLastLogin % 1440;
const minutesPassed = toFixedNr((timeSinceLastLogin % daysInMS) / 60000);
// }

let operations = [
	{
		creationDate: Date.now(), // e nxjerr rez ne kte Format: 1656711619665
		isDay: true, // nqs eshte false athere dihet qe eshte Op. normal dhe jo totali i Dites
	},
];

function calculateWinningsLoggedDB() {
	const winnings = operations.filter((operation) => operation.isDay);
}

function OperationsLoggedDB() {
	const ops = operations.filter((operation) => operation.isDay == false);
}

// for (let operation of operations) {
// 	if (operation.creationDate < last12Am) saOpPas12Jane = saOpPas12Jane + 1
// }

// function daysBotActive() { // Days that the bot was active ( from the initial moment it was deployed.)
// 	diteBotiAktiv = (bot.creationDate - currentDate) % 1440
// }

// let updatePageInfo = async () => {
// 	calcDaysBotLoggedDB();
// 	daysBotActive();
// }

function deleteOperationBefore12() {
	for (let operation of operations) {
		if (operation.creationDate < last12Am) {
			deleteRows();
		}
	}
}

// NQS USERI KA BO LOGIN PER HER TE FUNDIT NE 10:50 AM
// -> TANI ESHT ORA 1 AM
// 	-> USERI NE DB KA VETEM TRADES TE VJETER E JO TE DITES SE SOTME

// 	-> NE FILLIM DUHET TE FSHIHEN GJITH TRADES
//  -> PASTAJ MUND TE KRIJOHEN TE REJA VARSISHT SA TRADES DUHEN

//  * PRA NQS LOGIN I FUNDIT KA QENE PARA 12 ES QE KALOI
//  deleteAllRows();

// * NQS LOGIN I FUNDIT KA QENE MBAS ORES 12 QE KALOI
// duhet te check sa trades duhet te jen (logjika e kodit gati ne file tjt)
// duhet te check sa trades jane shenuar
// if ( tradesJan > tradesDuhetJen) {
// const amountToRemove = tradesJan - tradesDuhetJen
//
// deleteTrade(amountToRemove)
// }

const user = supabase.auth.user();
const lastLogin = user?.last_sign_in_at;

export const checkTradeAmount = async () => {
	const currentDate = new Date().getTime();
	const last12Am = new Date(new Date().setUTCHours(0, 0, 0, 0)).getTime();

	if (user) {
		userCreationTime = Date.parse(user?.created_at);
	}

	if (tradesJan > tradesDuhetJen) {
		let amountToRemove = tradesJan - tradesDuhetJen;
		const amountToRemoveCache = amountToRemove;
		let arrayToRemove = [];

		while (arrayToRemove.length < amountToRemoveCache) {
			arrayToRemove.push(operations[amountToRemove].id);
		}
	}

	if (tradesDuhetJen > tradesJan) {
	}
};

// Reference Variables / Functions
// diteBotiAktiv
// botWinningsDB
// GenerateDayRows(diteBotiAktiv, botWinningsDB);

// calculateOpPas12();
// let saOperationsDuhen = minutesLeft / 10

// if (saOperationsDuhen < saOpPas12Jane) {
// 	// Ndaj sa prej tyre nuk jane bere
// 	let OperationsToInsert = saOperationsDuhen - saOpPas12Jane
// 	GenerateOperations(OperationsToInsert: number)  // INSERT CHUNK si rows te DB [Op. details])
// }

// if (saOpPas12Jane < saOperationsDuhen) {
// 	saOpPas12Jane = calculateOpPas12()
// }

// Llogarit margin(shif me poshte)

// onMount(() => {
// 	deleteOperationBefore12
// 	updatePageInfo();
// })

// MARGIN:
// Margin te jete i shkeputur komplet nga kto te tjerat. te jete thjesht sa ore larg 12-es jena dhe sa % duhet te jete bere deri x moment nga FITIMI TOT I DITES

// --------------------------------
//* OnMount() {

// 	deleteOperationsAfter12();
// 	WinningsDB = calculateWinningsLoggedDB()
// 	OperationsDB = calculateOperationsLoggedDB()

// 	WinningsShouldBe = ((firstDeposit.date() - currentTime) / 8400000)
// 	OperationsShouldBe = (((firstDeposit.date() - currentTime) % 8400000) / 120000)
//
// 	let WinningsToInsert = WinningsShouldBe - WinningsDB
// 	let OperationsToInsert = OperationsShouldBe - OperationsDB
//
// 	if (WinningsToInsert > 0) {
// 		GenerateWinnigs(WinningsToInsert)
// 	}
// 	if (OperationsToInsert > 0) {
// 		GenerateOperations(OperationsToInsert)
// 	}
//
// 	if (WinningsToInsert < 0) {
//
//
// }
// }
// --------------------------------

// TODO: Pjesa e Margin nga ora 12 deri tani
