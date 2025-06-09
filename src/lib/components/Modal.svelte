<script lang="ts">
	import { t } from "$lib/services/i18n";
import { nav } from "$lib/stores/nav";

	import { createEventDispatcher } from "svelte";
	import InvestmentQuotas from "$lib/components/arbitrage/earnMore/InvestmentQuotas.svelte";

	const dispatch = createEventDispatcher();

	export let allowAccess: boolean = true;
	export let isOpenModal: boolean;
	// export let text: string;

	export let heading = '';
	export let subtext = '';
	export let dailyProfit = '';
	export let InvestNow = '';
	export let returnCTA = '';

	export let offerBest = "Best Investment";
	export let offerPopular = "Best Investment";

	function closeModal() {
		isOpenModal = false;
		dispatch("closeModal", { isOpenModal });
	}

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
			highlighted: 'popular',
			offer: offerPopular,
		},
		{
			percMin: 2.1,
			percMax: 4.2,
			amount: 50,
			highlighted: 'popular',
			offer: offerBest,
		},
	];


</script>

<div
	id="background"
	style="--display: {isOpenModal ? 'block' : 'none'};"
	class="bg-black opacity-90"
	on:click={closeModal}
/>
<div
	class="noScroll top-1/2 left-1/2 z-40 mx-auto flex  lg:w-10/12 w-11/12 flex-col items-center justify-center overflow-auto"
	id="modal"
	style="--display: {isOpenModal ? 'block' : 'none'};"
>
	<div
		class="noScroll flex flex-col items-center border border-borderColor bg-mainbg p-4 lg:pt-12"
	>
		<!-- <slot /> -->
		<div class="w-5/6">
			<p class="headingModal">{heading}</p>
			<p class="mt-6">
				{subtext}
			</p>
		</div>
		<div class="mt-12 grid w-full lg:grid-cols-3 gap-2">
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
	<div class="mt-4 flex items-center justify-center space-x-4">
		<a href="{$nav.deposit}" class="buttonBigGain">{$t('emInvestNowCTA')}</a>
		<button on:click={closeModal} class="buttonBigSecondary whitespace-nowrap"
			>{$t('returnCTA')}</button
		>
	</div>
</div>

<style>
	#background {
		display: var(--display);
		position: fixed;
		z-index:30;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
	}

	#modal {
		display: var(--display);
		position: fixed;
		transform: translate(-50%, -50%);
	}

	.secondary {
		box-shadow: inset 0px 0px 0px 1px #e8e8e8;
		box-sizing: border-box;
		color: #e8e8e8;
	}
</style>
