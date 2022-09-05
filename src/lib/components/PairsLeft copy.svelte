<script lang="ts">
	import { activePair, pairs } from "$lib/stores/pairs";
	import { createPairs } from "$lib/stores/pairs/api2";
	import { t, locale, locales } from "$lib/services/i18n";
	import { onMount } from "svelte";

	let searchInput: string = '';
	let active = "USDT";
	let baseCryptos;
</script>

<div class="border-borderColor bg-mainbg lg:w-1/4 lg:border-r">
	<div class="px-2 lg:pt-2">
		<div class="group relative flex items-center transition-all delay-75">
			<input
				type="text"
				class="inputInitial border-b-0 transition delay-75 hover:placeholder:text-[#63687A]"
				placeholder="Search"
				bind:value={searchInput}
			/>
			<div class="group absolute right-2 flex h-6 w-6 items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4 stroke-[#63687A] transition delay-75  hover:stroke-white group-focus:stroke-white group-active:stroke-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
		</div>
		<!-- svelte-ignore a11y-invalid-attribute -->

		<div class="w-full">
			<div
				class="flex h-12 items-center border-x border-b border-borderColor bg-secondarybg text-sm font-medium text-white"
			>
				<div
					class="flex h-full w-full items-center justify-center {active == 'BTC'
						? 'bg-mainbg text-main'
						: 'text-white'}"
				>
					<a href="#" class="" on:click={() => (active = "BTC")}>BTC</a>
				</div>
				<div
					class="flex h-full w-full items-center justify-center {active ==
					'USDT'
						? 'bg-mainbg text-main'
						: 'text-white'}"
				>
					<a href="#" class="" on:click={() => (active = "USDT")}>USDT</a>
				</div>
				<div
					class="flex h-full w-full items-center justify-center {active == 'ETH'
						? 'bg-mainbg text-main'
						: 'text-white'}"
				>
					<a href="#" class="" on:click={() => (active = "ETH")}>ETH</a>
				</div>
				<div
					class="flex h-full w-full items-center justify-center {active == 'XRP'
						? 'bg-mainbg text-main'
						: 'text-white'}"
				>
					<a href="#" class="" on:click={() => (active = "XRP")}>XRP</a>
				</div>
				<div
					class="flex h-full w-full items-center justify-center {active == 'BCH'
						? 'bg-mainbg text-main'
						: 'text-white'}"
				>
					<a href="#" class="" on:click={() => (active = "BCH")}>BCH</a>
				</div>
				<div
					class="flex h-full w-full items-center justify-center {active == 'XLM'
						? 'bg-mainbg text-main'
						: 'text-white'}"
				>
					<a href="#" class="" on:click={() => (active = "XLM")}>XLM</a>
				</div>
			</div>
			<div class="my-2 h-[1px] w-full bg-secondarybg" />
			<div
				class="mt-2 flex h-12 items-center border border-borderColor bg-mainbg text-white"
			>
				<p class="w-2/4 pl-2 text-sm font-semibold">{$t("homeLPairs")}</p>
				<p class="w-1/4 text-sm font-semibold">{$t("homeLLastPrice")}</p>
				<p class="w-1/4 pr-2 text-right text-sm font-semibold">
					{$t("homeLChange")}
				</p>
			</div>

			<div
				class="noScroll h-[22vh] overflow-auto border-b border-borderColor text-white lg:h-[81vh]"
			>
				<table id="pairsLeft" class="relative m-0 w-full table-fixed text-sm">
					<tbody class="noScroll overflow-auto text-xs">
						{#await createPairs(active)}
							<tr
								class="h-12 border-x border-b border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg"
							>
								<td class="w-2/4 pl-2 ">Loading</td>
								<td class="w-1/4">Loading</td>
								<td class="w-1/4 pr-2 text-right">Loading</td>
							</tr>
						{:then data}
							{#each data as { symbol, value, change, primary }, i}
								<tr
									on:click={() => {
										activePair.set(symbol);
									}}
									class="h-12 border-x border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg"
								>
									<td class="w-2/4 pl-2 ">{symbol}</td>
									<td class="w-1/4">{value.toFixed(6)}</td>
									<td
										class="w-1/4 pr-2 text-right {change < 0
											? 'text-loss'
											: 'text-gain'}">{change < 0 ? change.toFixed(3) : `+${change.toFixed(3)}`}</td
									>
								</tr>
							{/each}
						{/await}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
