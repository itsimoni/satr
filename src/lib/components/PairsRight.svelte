<script lang="ts">
	import { activePair, asksBook, bidsBook, pairs } from "$lib/stores/pairs";
	let active = $activePair;

	import { t } from "$lib/services/i18n";
	import { onMount } from "svelte";
import { companyWebsite } from "$lib/stores/store";
	let changePerc = 3.163;
	let changeAsksPerc = 2.172;
	let date = new Date();
	let bids = [];
	let asks = [];

	function checkTime(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}

	async function getOrderBook() {
		bids = [];
		asks = [];
		date = new Date();
		rightNow =
			checkTime(date.getHours()) +
			":" +
			checkTime(date.getMinutes()) +
			":" +
			checkTime(date.getSeconds());
		const searchQuery = $activePair.replace("/", "");
		const endpoint = `${companyWebsite}/orderBook?symbol=${searchQuery}`;

		const response = await fetch(endpoint);
		const data = await response.json();

		bids = await data.bids;
		asks = await data.asks;
	}

	function fixNumber(i) {
		let number = i.toString();
		return number.slice(0, 7);
	}

	$: active = $activePair.replace("/", "");
	$: $activePair, getOrderBook();

	let rightNow = "00:00:00";
</script>

<div class="border-borderColor bg-mainbg lg:w-1/4">
	<div class="px-2 lg:pt-2">
		<div class="w-full">
			<div
				class="mb-2 flex h-12 items-center justify-between bg-secondarybg p-2 text-sm font-medium text-white"
			>
				<p class="">{$t("homeROrderBook")}</p>
				<!-- TODO -->
				<button class="text-xs" on:click={getOrderBook}>Refresh Orders</button>
			</div>
			<div class="my-2 h-[1px] w-full bg-secondarybg" />

			<div
				class="mb-2 flex h-8 items-center justify-between border border-borderColor bg-mainbg text-sm font-medium text-white"
			>
				<p class="px-2 text-xs">{$t("homeRBids")}</p>
				<!-- <div class="flex h-full items-center bg-secondarybg px-2">
					<p class="ml-2 text-xs">
						
					</p>
				</div> -->
			</div>
			<div
				class="flex h-12 items-center whitespace-nowrap border border-borderColor bg-mainbg text-xs text-white"
			>
				<p class="w-4/12 pl-2 font-medium">{$t("homeRPrice")}</p>
				<p class="w-2/12 font-medium">{$t("homeRAmount")}</p>
				<p class="w-6/12 pr-2 text-right font-medium">
					{$t("homeRTimestamp")} (Received)
				</p>
				<!-- <p class="w-3/12 pr-2 text-right font-medium">{$t("homeRTimestamp")}</p> -->
			</div>

			<div
				class="noScroll h-[17vh] overflow-auto border-b border-borderColor text-white lg:h-[34vh]"
			>
				<table id="pairsLeft" class="relative m-0 w-full table-fixed text-sm">
					<tbody class="noScroll overflow-auto text-xs">
						{#key bids}
							{#if bids.length > 0 && bids[0] !== "Unavailable"}
								{#each bids as bid, i}
									<tr
										class="h-8 border-x border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg"
									>
										<td class="w-4/12 pl-2 text-loss">{fixNumber(bid[0])}</td>
										<td class="w-2/12">{fixNumber(bid[1])}</td>
										<td class="w-6/12 pr-2 text-right">{rightNow}</td>
									</tr>
								{/each}
							{/if}
							{#if bids.length > 0 && bids[0] === "Unavailable"}
								<tr
									class="h-8 border-x border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg"
								>
									<td class="w-4/12 pl-2 text-gain">Unavailable</td>
									<td class="w-2/12">Unavailable</td>
									<td class="w-6/12 pr-2 text-right">Unavailable</td>
								</tr>
							{/if}
							{#if bids.length == 0}
								<tr
									class="h-8 border-x border-b border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg"
								>
									<td class="w-4/12 pl-2 text-loss">Loading</td>
									<td class="w-4/12">Loading</td>
									<td class="w-4/12 pr-2 text-right">Loading</td>
								</tr>
							{/if}
						{/key}
					</tbody>
				</table>
			</div>
			<div class="my-2 h-[1px] w-full bg-secondarybg" />

			<div
				class="mb-2 mt-2 flex h-8 items-center justify-between border border-borderColor bg-mainbg text-sm font-medium text-white"
			>
				<p class="px-2 text-xs">{$t("homeRAsks")}</p>
				<!-- <div class="flex h-full items-center bg-secondarybg px-2">
					<p class="ml-2 text-xs">
						{$t("homeRChange")}<span
							class={changeAsksPerc > 0 ? "text-gain" : "text-loss"}
							>{changeAsksPerc} %</span
						>
					</p>
				</div> -->
			</div>
			<div
				class="flex h-12 items-center whitespace-nowrap border border-borderColor bg-mainbg text-xs text-white"
			>
				<p class="w-4/12 pl-2 font-medium">{$t("homeRPrice")}</p>
				<p class="w-2/12 font-medium">{$t("homeRAmount")}</p>
				<p class="w-6/12 pr-2 text-right font-medium">
					{$t("homeRTimestamp")} (Received)
				</p>
			</div>
			<div
				class="noScroll h-[17vh] overflow-auto border-b border-borderColor text-white lg:h-[34vh]"
			>
				<table id="pairsLeft" class="relative m-0 w-full table-fixed text-sm">
					<tbody class="noScroll overflow-auto text-xs">
						<!-- {#each $asksBook as { price, amount }, i}
							<tr
								class="h-8 border-x border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg"
							>
								<td class="w-4/12 pl-2 text-gain">{price}</td>
								<td class="w-2/12">{amount}</td>
								<td class="w-3/12 pr-2 text-right">{amount * $pairs[5].last}</td
								>
								<td class="w-3/12 pr-2 text-right"
									>{date.getSeconds()}:{date.getMinutes()}:{date.getHours()}</td
								>
							</tr>
						{/each} -->
						{#key asks}
							{#if asks.length > 0 && asks[0] !== "Unavailable"}
								{#each asks as ask, i}
									<tr
										class="h-8 border-x border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg"
									>
										<td class="w-4/12 pl-2 text-gain">{fixNumber(ask[0])}</td>
										<td class="w-2/12">{fixNumber(ask[1])}</td>
										<td class="w-6/12 pr-2 text-right">{rightNow}</td>
									</tr>
								{/each}
							{/if}
							{#if asks.length > 0 && asks[0] === "Unavailable"}
								<tr
									class="h-8 border-x border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg"
								>
									<td class="w-4/12 pl-2 text-gain">Unavailable</td>
									<td class="w-2/12">Unavailable</td>
									<td class="w-6/12 pr-2 text-right">Unavailable</td>
								</tr>
							{/if}
							{#if asks.length == 0}
								<tr
									class="h-8 border-x border-b border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg"
								>
									<td class="w-4/12 pl-2 text-gain">Loading</td>
									<td class="w-4/12">Loading</td>
									<td class="w-4/12 pr-2 text-right">Loading</td>
								</tr>
							{/if}
						{/key}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
