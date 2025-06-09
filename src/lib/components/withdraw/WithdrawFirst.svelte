<script lang="ts">
	import { nav } from "$lib/stores/nav";
	import Cryptocurrency from "$lib/components/withdraw/Cryptocurrency.svelte";
	import BankTransfer from "$lib/components/withdraw/BankTransfer.svelte";
	import { onMount } from "svelte";
	import { btcAddress, companyName } from "$lib/stores/store";
	import { t } from "$lib/services/i18n";
	import WithdrawFirst from "$lib/components/withdraw/WithdrawFirst.svelte";
	import SelectCard from "./SelectCard.svelte";
	let routes = [
		{ step: 1, component: Cryptocurrency },
		{ step: 2, component: BankTransfer },
	];

	let route: any;
	let selected: string = "";
	let activePage = "";
	let amount: number;
	let clicked: boolean = false;
	let amountEur: number = 1;
	let emailAddress: string = "";

	let backButton = $nav.trade;

	let options = [
		{
			title: "Cryptocurrencies",
			subtitle: $t("wdCryptoText1"),
			selected: false,
		},
		{
			title: "Bank Transfer",
			subtitle: $t("wdBankText"),
			selected: false,
		},
		{
			title: "Credit Card",
			subtitle: $t("wdCreditText"),
			selected: false,
		},
	];

	function checkState() {
		if (route) {
			route = "";
			backButton = "#";
			activePage = "";
		} else backButton = $nav.trade;
	}

	function handleState(event: any) {
		if (event.detail.text == "Cryptocurrencies") {
			// route = routes[0].component;`
			options[0].selected = true;
			options[1].selected = false;
			options[2].selected = false;
			selected = "Cryptocurrencies";
		}
		if (event.detail.text == "Bank Transfer") {
			// route = routes[1].component;
			options[0].selected = false;
			options[1].selected = true;
			options[2].selected = false;
			selected = "Bank Transfer";
		}
		if (event.detail.text == "Credit Card") {
			// route = routes[1].component;
			options[0].selected = false;
			options[1].selected = false;
			options[2].selected = true;
			selected = "Credit Card";
		}
	}

	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	function dispatchContinue() {
		dispatch("continue", {
			selected: selected,
		});
	}
</script>

<div
	class="flex w-full flex-col justify-between px-4 pt-10 font-inter text-white md:w-1/2"
>
	<div>
		<h2 class="textHeading text-main">{$t("wdTitle")}</h2>
		<p class="mt-2 break-words ">
			{$t("wdText")}</p>
		<form
			on:submit|preventDefault={dispatchContinue}
			class="mt-12 space-y-4 text-white"
		>
			{#key options}
				{#each options as option}
					<SelectCard
						title={option.title}
						subtext={option.subtitle}
						selected={option.selected}
						on:message={handleState}
					/>
				{/each}
			{/key}
			<div
				class="my-4 mt-12 inline-flex space-x-4 md:absolute md:bottom-4 md:left-4 md:my-0"
			>
				<button type="submit" class="buttonBig px-8 " disabled={!selected}>
					{$t("CryptoContinue")}</button
				>
			</div>
		</form>
	</div>
</div>
<div
	class="topoBg mt-12 flex w-full flex-col items-center justify-center bg-secondarybg py-14 md:mt-0 md:w-2/5"
/>
