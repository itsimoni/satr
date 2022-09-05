<script lang="ts">
	import { nav } from "$lib/stores/nav";
	import Cryptocurrency from "$lib/components/withdraw/Cryptocurrency.svelte";
	import BankTransfer from "$lib/components/withdraw/BankTransfer.svelte";
	import { companyName } from "$lib/stores/store";
	import { t } from "$lib/services/i18n";
	import WithdrawFirst from "$lib/components/withdraw/WithdrawFirst.svelte";
	import CreditCard from "$lib/components/withdraw/CreditCard.svelte";
	import { mainPage } from "$lib/stores/withdraw/route";
	let routes = [
		{ step: 1, component: Cryptocurrency },
		{ step: 2, component: BankTransfer },
		{ step: 3, component: CreditCard },
	];

	let route: any;
	let selected: number = 1;
	let activePage = "";

	function handleState(event) {
		if (event.detail.selected == "Cryptocurrencies") {
			route = routes[0].component;
			mainPage.set(false);
		}
		if (event.detail.selected == "Bank Transfer") {
			route = routes[1].component;
			mainPage.set(false);
		}
		if (event.detail.selected == "Credit Card") {
			route = routes[2].component;
			mainPage.set(false);
		}
	}

	let backButton = $nav.trade;

	function checkState() {
		if (route) {
			route = "";
			backButton = "#";
			activePage = "";
			selected = 1;
		} else backButton = $nav.trade;
	}

	// const { user: us } = get(session);
	// async function uploadDB() {
	// 	const { data, error } = await supabase.from("DepositBTC").insert([
	// 		{
	// 			dAmount: amountEur,
	// 			dDetails: emailAddress,
	// 			uuid: us.id,
	// 		},
	// 	]);

	// 	if (error) {
	// 		return console.error(error);
	// 	}
	// 	uploadTransaction();
	// 	goto("fund/thankyou");
	// }

	// async function uploadTransaction() {
	// 	const { data, error } = await supabase.from("TransactionHistory").insert([
	// 		{
	// 			thType: "Deposit",
	// 			thDetails: `Funding Account`,
	// 			uuid: us.id,
	// 			thEmail: us.email

	// 		},
	// 	]);

	// 	if (error) {
	// 		return console.error(error);
	// 	}
	// }
</script>

<title>Deposit - {$companyName}</title>

<!-- <BankTransfer /> -->
<!-- <WithdrawFirst></WithdrawFirst> -->
<div
	class="flex flex-col justify-between bg-mainbg font-inter md:flex-row lg:h-[95vh]"
>
	<!-- <Cryptocurrency /> -->
	{#if $mainPage}
		<WithdrawFirst on:continue={handleState} />
	{/if}
	{#if !$mainPage}
		<svelte:component this={route} />
	{/if}
</div>
