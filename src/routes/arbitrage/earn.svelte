<script lang="ts">
	import { locale, t } from "$lib/services/i18n";
	import { nav } from "$lib/stores/nav";
	import InvestmentQuotas from "$lib/components/arbitrage/earnMore/InvestmentQuotas.svelte";
	import { goto } from "$app/navigation";

	let investmentOptions = [
		{
			percMin: 0.2,
			percMax: 0.5,
			amount: 0.01,
			offer: $t("emShrimp"),
		},
		{
			percMin: 0.35,
			percMax: 0.7,
			amount: 0.1,
			offer: $t("emCrab"),
		},
		{
			percMin: 0.6,
			percMax: 1,
			amount: 1,
			offer: $t("emoctopus"),
		},
		{
			percMin: 0.8,
			percMax: 1.3,
			amount: 5,
			offer: $t("emMembership"),
		},
		{
			percMin: 1.2,
			percMax: 2.6,
			amount: 10,
			highlighted: "popular",
			offer: $t("emPopular"),
		},
		{
			percMin: 2.1,
			percMax: 4.2,
			amount: 50,
			highlighted: "popular",
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
