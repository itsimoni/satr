
let numbersGenerated:any = []
let newNumbersGenerated:any = []

export function randomIntFromInterval(min:number, max:number) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function checkNotSame(number:number) {
	let newNumber = 0;
	newNumber = randomIntFromInterval(1, 4)
	while (newNumber == number) {
		newNumber = randomIntFromInterval(1, 4)
	}
	return newNumber;
}

function generate(max:number, thecount:number) {
	var r = [];
	var currsum = 0;
	for (var i = 0; i < thecount; i++) {
		r.push(Math.random());
		currsum += r[i];
	}
	for (var i = 0; i < r.length; i++) {
		r[i] = Math.round(r[i] / currsum * max);
	}
	numbersGenerated.push(...r)
}

function shuffle(array: []) {
	let currentIndex = array.length, randomIndex;

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
}

export const generateNumbers = (max:number) => {

	generate(max, 5)

	const loss = randomIntFromInterval(0, 4);
	const antiLoss = checkNotSame(loss)

	const lossNegative = Math.abs(numbersGenerated[loss]) * -1
	const antiLossWithDifference = numbersGenerated[loss] * 2 + numbersGenerated[antiLoss]

	const numberThatWillBeRemoved = numbersGenerated[antiLoss]
	numbersGenerated.splice(loss, 1)

	for (var i = 0; i < numbersGenerated.length; i++) {
		if (numbersGenerated[i] === numberThatWillBeRemoved) {
			numbersGenerated.splice(i, 1);
		}
	}
	
	newNumbersGenerated.push(lossNegative, ...numbersGenerated, antiLossWithDifference)
	return shuffle(newNumbersGenerated);
}