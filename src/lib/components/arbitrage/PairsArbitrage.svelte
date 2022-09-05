<script lang="ts">
	import { Random } from "$lib/logic/random";
	let searchInput: string;
	let active = "BNB";
	export let symbol: any = "";
	export let exchange: string, exchange2: string;
	import { t } from "$lib/services/i18n";
	import { onMount } from "svelte";

	// const rand = new Random(132);

	let changePerc = 3.163;
	function checkTime(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}
	export let bids: any = [];
	export let asks: any = [];

	let bidsGenerated: any = [];
	let asksGenerated: any = [];

	let rightNow = "00:00:00";
	let date = new Date();

	function getTime() {
		date = new Date();
		rightNow =
			checkTime(date.getHours()) +
			":" +
			checkTime(date.getMinutes()) +
			":" +
			checkTime(date.getSeconds());
	}

	function randomIntFromInterval(
		min: number,
		max: number,
		decimalPlaces: number
	) {
		var rand =
			Math.random() < 0.5
				? (1 - Math.random()) * (max - min) + min
				: Math.random() * (max - min) + min; // could be min or max or anything in between
		var power = Math.pow(10, decimalPlaces);

		return Math.floor(rand * power) / power;
	}

	function calculateNewPrice(i: any) {
		let number = fixNumber(i);
		let numbered = Number(number);
		let result: any =
			numbered + (numbered / 100) * randomIntFromInterval(1, 2, 2);
		result = result.toString();
		return result.slice(0, 7);
	}

	function calculateNewPriceAsks(i: any) {
		let number = fixNumber(i);
		let numbered = Number(number);
		let result: any =
			numbered - (numbered / 100) * randomIntFromInterval(1, 2, 2);
		result = result.toString();
		return result.slice(0, 7);
	}

	function fixNumber(i) {
		let number = i.toString();
		return number.slice(0, 7);
	}

	$: bids, getTime();

	let minValueAsks = 1.12;
	let maxValueAsks = 48.78;

	let minValueBids = 1.12;
	let maxValueBids = 48.78;

	let medianBids: any = 0;
	let medianAsks: any = 0;

	function genRandom(number) {
		let numberGenerated = number;
		let numberAlternate = ((numberGenerated / 100) * 20)
		let result = randomIntFromInterval(numberAlternate, numberGenerated, 7)

		return result.toString().slice(0,7)
	}

</script>

<div
	class="flex flex-col space-y-2 p-2 text-left lg:flex-row lg:space-x-4 lg:space-y-0 lg:p-4"
>
	<div>
		<p class="mb-2 text-sm">{exchange}</p>

		<div
			class="flex h-8 items-center whitespace-nowrap border-[0.5px] border-borderColor bg-mainbg text-xs text-white"
		>
			<p class="w-4/12 pl-2 font-medium">{$t("homeRPrice")}</p>
			<p class="w-4/12  font-medium">
				{$t("homeRAmount")} ({symbol})
			</p>
			<p class="w-4/12 pr-2 text-right font-medium">{$t("homeRTimestamp")}</p>
		</div>

		<div class="noScroll h-12 overflow-auto text-white lg:h-24">
			<table id="pairsLeft" class="relative m-0 w-full table-fixed text-sm ">
				<tbody class="noScroll text-xs">
					{#each bids as bid, i}
						<tr
							class="h-6 border-x-[0.5px] border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg"
						>
							<td class="w-4/12 pl-2 text-loss">{fixNumber(bid[0])}</td>
							<td class="w-4/12 ">{fixNumber(bid[1])}</td>
							<td class="w-4/12 pr-2 text-right">{rightNow}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div
			class="noScroll h-12 overflow-auto border-y-[0.5px] border-borderColor text-white lg:h-24"
		>
			<table id="pairsLeft" class="relative m-0 w-full table-fixed text-sm">
				<tbody class="noScroll text-xs">
					{#each asks as ask, i}
						<tr
							class="h-6 border-x-[0.5px] border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg"
						>
							<td class="w-4/12 pl-2 text-gain">{fixNumber(ask[0])}</td>
							<td class="w-4/12 ">{fixNumber(ask[1])}</td>
							<td class="w-4/12 pr-2 text-right">{rightNow}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
	<div>
		<p class="mb-2 text-sm">{exchange2}</p>

		<div
			class="flex h-8 items-center whitespace-nowrap border-[0.5px] border-borderColor bg-mainbg text-xs text-white"
		>
			<p class="w-4/12 pl-2 font-medium">{$t("homeRPrice")}</p>
			<p class="w-4/12  font-medium">{$t("homeRAmount")} ({symbol})</p>
			<p class="w-4/12 pr-2 text-right font-medium">{$t("homeRTimestamp")}</p>
		</div>

		<div class="noScroll h-12 overflow-auto text-white lg:h-24">
			<table id="pairsLeft" class="relative m-0 w-full table-fixed text-sm ">
				<tbody class="noScroll text-xs">
					{#key bidsGenerated}
						{#each bids as bid, i}
							<tr
								class="h-6 border-x-[0.5px] border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg"
							>
								<td class="w-4/12 pl-2 text-loss"
									>{calculateNewPrice(bid[0])}</td
								>
								<td class="w-4/12 ">{genRandom(bid[1])}</td>
								<td class="w-4/12 pr-2 text-right">{rightNow}</td>
							</tr>
						{/each}
					{/key}
				</tbody>
			</table>
		</div>
		<div
			class="noScroll h-12 overflow-auto border-y-[0.5px] border-borderColor text-white lg:h-24 "
		>
			<table id="pairsLeft" class="relative m-0 w-full table-fixed text-sm ">
				<tbody class="noScroll text-xs">
					{#key asksGenerated}
						{#each asks as ask, i}
							<tr
								class="h-6 border-x-[0.5px] border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg"
							>
								<td class="w-4/12 pl-2 text-gain"
									>{calculateNewPriceAsks(ask[0])}</td
								>
								<td class="w-4/12 "
									>{genRandom(ask[1])}</td
								>
								<td class="w-4/12 pr-2 text-right">{rightNow}</td>
							</tr>
						{/each}
					{/key}
				</tbody>
			</table>
		</div>
	</div>
</div>
