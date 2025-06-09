<script lang="ts">
	import {
		loadWithdrawHistory,
		withdrawHistory,
	} from "$lib/stores/transactions";
	import { t } from "$lib/services/i18n";
	import Pagination from "$lib/components/tables/pagination/src/Pagination.svelte";
	import { companyName } from "$lib/stores/store";
	import { onMount } from "svelte";
	import Footer from "$lib/components/Footer.svelte";
	import Withdraw from "./withdraw.svelte";

	let value = 1;
	let activePage = 1;
	let current = 1;
	let num_items = 30;
	let per_page = 5;

	function getSelectValue(stringValue: string) {
		return parseInt(stringValue);
	}

	function convertMSToDate(time: number) {
		let date = new Date(time).toDateString();
		return date;
	}

	function calculateSymbol(currency: String) {
		if (currency == null) return '€';
		if (currency == 'btc') return 'BTC';
		if (currency == 'eth') return 'ETH';
	}
</script>

<title>Withdraw History - {$companyName}</title>
<div
	class="flex min-h-screen min-w-full flex-col items-center bg-mainbg pb-12 font-inter"
>
	<div class="topoBg flex w-full flex-col items-center py-20 text-center">
		<div class="w-8/12">
			<h1 class="textHeading">{$t("withdrawHistoryHeading")}</h1>
		</div>
	</div>
	<div class="w-full px-2 lg:w-8/12 lg:px-0">
		<div class="noScroll overflow-x-auto border border-borderColor ">
			<table class="w-full text-left text-sm text-gray-400 ">
				<thead
					class="border-b border-borderColor bg-secondarybg text-xs uppercase text-gray-400"
				>
					<tr>
						<th scope="col" class="px-4 py-3 pl-4">SL</th>
						<th scope="col" class="px-4 py-3">{$t("tbTransactionID")}</th>
						<th scope="col" class="px-4 py-3">Status</th>
						<th scope="col" class="px-4 py-3 ">{$t("amount")}</th>
						<th scope="col" class="px-4 py-3">{$t("tbDate")}</th>
					</tr>
				</thead>
				<tbody>
					{#await loadWithdrawHistory()}
						<tr
							class="border-borderColor bg-mainbg odd:bg-mainbg even:bg-secondarybg even:bg-opacity-50 odd:hover:bg-secondarybg even:hover:bg-opacity-100"
						>
							<td class="px-4 py-4 pl-4">Loading</td>
							<th
								scope="row"
								class="whitespace-nowrap px-4 py-4 font-medium text-white"
								>Loading
							</th>
							<td class="px-4 py-4">Loading</td>
							<td class="px-4 py-4">Loading</td>
							<td class="px-4 py-4">Loading</td>
						</tr>
					{:then data}
						<!-- {#key transactions} -->
						{#each withdrawHistory as withdraw, i}
							<tr
								class="border-borderColor bg-mainbg odd:bg-mainbg even:bg-secondarybg even:bg-opacity-50 odd:hover:bg-secondarybg even:hover:bg-opacity-100"
							>
								<td class="px-4 py-4 pl-4">{i + 1}</td>
								<th
									scope="row"
									class="whitespace-nowrap px-4 py-4 font-medium text-white"
									>Withdraw through {withdraw.details}
								</th>
								{#if withdraw.confirmed == null}
									<td class="px-4 py-4 flex items-center space-x-2 text-yellow-400">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<p>Pending</p>
									</td>
								{/if}
								{#if withdraw.confirmed == true}
									<td class="px-4 py-4 flex items-center space-x-2 text-gain">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<p>Successful</p>
									</td>
								{/if}
								{#if withdraw.confirmed == false}
									<td class="px-4 py-4 flex items-center space-x-2 text-loss">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 stroke-loss"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<p>Unsuccessful</p>
									</td>
								{/if}
								<td class="px-4 py-4">{withdraw.amount} {calculateSymbol(withdraw.symbol)}</td>
								<td class="px-4 py-4">{convertMSToDate(withdraw.time)}</td>
							</tr>
						{/each}
						<!-- {/key} -->
					{/await}
				</tbody>
			</table>
		</div>
	</div>
</div>
<Footer></Footer>