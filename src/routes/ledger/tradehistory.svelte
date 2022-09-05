<script lang="ts">
	import { t } from "$lib/services/i18n";
	import { loadTrades, trades } from "$lib/stores/transactions";
	import Pagination from "$lib/components/tables/pagination/src/Pagination.svelte";
	import { companyName } from "$lib/stores/store";
	import { onMount } from "svelte";

	function convertMSToDate(time: number) {
		let date = new Date(time).toDateString();
		return date;
	}
	let num_items = 30;

	let rows = [];
	let page = 0;
	let totalPages: any = [];
	let currentPageRows = [];
	let itemsPerPage = 10;
	let loading = true;

	$: currentPageRows = totalPages.length > 0 ? totalPages[page] : [];

	const paginate = (items) => {
		const pages = Math.ceil(items.length / itemsPerPage);

		const paginatedItems = Array.from({ length: pages }, (_, index) => {
			const start = index * itemsPerPage;
			return items.slice(start, start + itemsPerPage);
		});

		totalPages = [...paginatedItems];
	};

	async function updateTable(tr) {
		rows = tr;
		paginate(rows);
	}

	onMount(async () => {
		const trades = await loadTrades();
		num_items = await trades.length;

		updateTable(await trades);
	});

	const setPage = (p) => {
		if (p >= 0 && p < totalPages.length) {
			page = p;
		}
	};

	let pageWrong: number;

	function getSelectValue(stringValue: string) {
		return parseInt(stringValue);
	}

	$: per_page = getSelectValue(per_pageCache);
	let per_pageCache = "10";

	$: page = pageWrong - 1;
	$: updateTable(trades);
</script>

<title>Trade History - {$companyName}</title>
<div
	class="flex min-h-screen  min-w-full flex-col items-center bg-mainbg pb-12 font-inter"
>
	<div class="topoBg flex w-full flex-col items-center py-20 text-center">
		<div class="w-full px-4 lg:w-8/12 lg:px-0">
			<h1 class="textHeading">{$t("tradeHistoryHeading")}</h1>
			<p class="mt-4 text-sm text-white opacity-70">
				Financial Data and timestamps are based on (UTC) Coordinated Universal
				Time.
			</p>
		</div>
	</div>
	<div class="w-full px-2 lg:w-8/12 lg:px-0">
		<div class="noScroll overflow-x-auto border border-borderColor">
			<table class="w-full text-left text-sm text-gray-400 ">
				<thead
					class="border-b border-borderColor bg-secondarybg text-xs uppercase text-gray-400"
				>
					<tr>
						<th scope="col" class="px-4 py-3 pl-4">SL</th>
						<th scope="col" class="px-4 py-3">{$t("tbTransactionID")}</th>
						<th scope="col" class="px-4 py-3">{$t("tbDetails")}</th>
						<th scope="col" class="px-4 py-3 ">{$t("amount")}</th>
						<th scope="col" class="px-4 py-3 ">{$t("tbRemainingBalance")}</th>
						<th scope="col" class="px-4 py-3">{$t("tbDate")}</th>
					</tr>
				</thead>
				<tbody>
					{#if currentPageRows.length == 0}
						<tr
							class="border-borderColor bg-mainbg odd:bg-mainbg even:bg-secondarybg even:bg-opacity-50 odd:hover:bg-secondarybg even:hover:bg-opacity-100"
						>
							<td class="px-4 py-4 pl-4">1</td>
							<th
								scope="row"
								class="whitespace-nowrap px-4 py-4 font-medium text-white"
								>Loading
							</th>
							<td class="px-4 py-4">Loading</td>
							<td class="px-4 py-4">Loading</td>
							<td class="px-4 py-4">Loading</td>
							<td class="px-4 py-4">Loading</td>
						</tr>
					{/if}
					{#if currentPageRows.length > 0}
						{#each currentPageRows as row, i}
							<!-- {#each trades as transaction, i} -->
							<tr
								class="border-borderColor bg-mainbg odd:bg-mainbg even:bg-secondarybg even:bg-opacity-50 odd:hover:bg-secondarybg even:hover:bg-opacity-100"
							>
								<td class="px-4 py-4 pl-4">{row.sl}</td>
								<th
									scope="row"
									class="whitespace-nowrap px-4 py-4 font-medium text-white"
									>{row.tId}
								</th>
								<td class="px-4 py-4">{row.details}</td>
								<td class="px-4 py-4">{row.amount} BTC</td>
								<td class="px-4 py-4">{row.remainingBalance} BTC</td>
								<td class="px-4 py-4">{convertMSToDate(row.time)}</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
		<div
			class="mt-2 flex items-center justify-between text-gray-400"
			onselectstart="return false"
		>
			<div class="flex items-center text-sm">
				Entries displayed per Page: 10
			</div>
			{#key num_items}
				<Pagination
					small
					bind:current={pageWrong}
					{num_items}
					per_page={10}
					rounded
				/>
			{/key}
		</div>
	</div>
</div>
