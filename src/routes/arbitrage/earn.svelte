<script lang="ts">
	import { locale, t } from "$lib/services/i18n";
	import { nav } from "$lib/stores/nav";
	import InvestmentQuotas from "$lib/components/arbitrage/earnMore/InvestmentQuotas.svelte";
	import { goto } from "$app/navigation";

	let investmentOptions = [
		{
			percMin: 0.6,
			percMax: 0.8,
			amount: 250,
		},
		{
			percMin: 0.8,
			percMax: 1,
			amount: 500,
		},
		{
			percMin: 1,
			percMax: 1.1,
			amount: 1000,
		},
		{
			percMin: 1.1,
			percMax: 1.2,
			amount: 2500,
		},
		{
			percMin: 1.2,
			percMax: 1.3,
			amount: 10000,
		},
		{
			percMin: 1.3,
			percMax: 1.4,
			amount: 20000,
		},
		{
			percMin: 1.4,
			percMax: 1.5,
			amount: 30000,
			highlighted: "popular",
			offer: $t("emPopular"),
		},
		{
			percMin: 1.5,
			percMax: 1.6,
			amount: 60000,
			highlighted: "best",
			offer: $t("emBest"),
		},
	];
</script>

<div
	class="noScroll mx-auto w-full bg-mainbg p-4 text-center font-inter text-white min-h-screen"
	id="modal"
>
	{#key $locale}
		<div class="">
			<!-- <slot /> -->
			<div class="w-full">
				<p class="headingModal">{$t("emHeading")}</p>
				<p class="mt-6">
					{$t("emSubtext")}
				</p>
			</div>
			<div class="mt-12 grid w-full gap-4 lg:grid-cols-4">
				{#each investmentOptions as investmentOption}
					<InvestmentQuotas
						percMin={investmentOption.percMin}
						percMax={investmentOption.percMax}
						amount={investmentOption.amount}
						highlighted={investmentOption.highlighted}
						offer={investmentOption.offer}
					/>
				{/each}
			</div>
		</div>
	{/key}
	<div class="mt-4 flex items-center justify-center space-x-4">
		<a href={$nav.deposit} class="buttonBigGain">{$t("emInvestNowCTA")}</a>
		<button
			on:click={() => goto($nav.bot)}
			class="buttonBigSecondary whitespace-nowrap">{$t("returnCTA")}</button
		>
	</div>
</div>
