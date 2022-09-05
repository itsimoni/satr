<script lang="ts">
	import { onMount } from "svelte";
	import {
		amountUsd,
		btcAddress,
		companyName,
		companyWebsite,
		invested,
	} from "$lib/stores/store";

	// const { user: us } = get(session);

	let conversionRate: number = 0;
	let amount: number;
	let clicked: string = "";
	let amountEur: number = 1;
	let emailAddress: string = "";

	async function calculateConversionRate() {
		let values = [];
		let value;
		fetch(`https://blockchain.info/tobtc?currency=EUR&value=1`)
			.then((response) => response.json())
			.then((response) => {
				conversionRate = response;
			});
	}

	onMount(async function () {
		calculateConversionRate();
		syncCurrencies();
	});

	let btcAdd = $btcAddress;
	function copyToClipboard() {
		navigator.clipboard.writeText(btcAdd).then(
			function () {
				clicked = "successful";
			},
			function (err) {
				clicked = "failed";
			}
		);
	}

	const checkEdited = (numberEntered: number) => {
		if (numberEntered !== null && numberEntered !== undefined) {
			return numberEntered;
		}
		return 0;
	};

	import { t } from "$lib/services/i18n";
	import { goto } from "$app/navigation";
	import supabase from "$lib/db";
	let firstName: string = "";
	let lastName: string = "";
	
	$: if (clicked == "successful") {
		setTimeout(() => {
			clicked = "";
		}, 500);
	}
	$: amountInBtc = +(amountEur * conversionRate).toFixed(5);
	$: amountEur = checkEdited(amount);
	$: amountInUsd = eurConversionRate * amountEur;

	let eurConversionRate: any = 1;

	let formReady: boolean = false;

	const checkState = async () => {
		const userId = supabase.auth.user();
		const {data, error} = await supabase.from('Deposits').insert([{
			uuid: userId?.id,
			dFname: firstName,
			dLname: lastName,
			dEmail: emailAddress,
			dDetails: 'Deposit through Cryptocurrency',
			dAmount: amount,
		}])
		if (error) console.log(error);
		
		continueToCheckout();
	}

	const continueToCheckout = async () => {
		try {
			const response = await fetch("https://www.poof.io/api/v1/checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: {companyName},
					amount: amountInUsd,
					fields: ["Email", "Name"],
					redirect: companyWebsite,
				}),
			});
			const data = await response.text();
			goto(await data);
		} catch (error) {
			console.error(error);
		}
	};
</script>

<title>Deposit - {$companyName}</title>
<div
	class="flex flex-col justify-between bg-mainbg font-inter text-sm md:flex-row lg:h-[95vh]"
>
	<div class="flex flex-col justify-between px-4 pt-10">
		<div>
			<h2 class="textHeading ">{$t("depositHeading")}</h2>
			<p class="break-words" />
			<form
				on:submit|preventDefault={checkState}
				class="mt-12 space-y-6 text-white"
			>
				<div class="flex space-x-4">
					<div class="w-full">
						<p class="mb-2 ">First Name</p>
						<input
							required
							bind:value={firstName}
							placeholder="John"
							name="User Name"
							type="text"
							class="inputInitial"
						/>
					</div>
					<div class="w-full">
						<p class="mb-2 ">Last Name</p>
						<input
							required
							bind:value={lastName}
							placeholder="Doe"
							name="User Name"
							type="text"
							class="inputInitial"
						/>
					</div>
				</div>
				<div>
					<p class="mb-2 ">{$t("emailAddress")}</p>
					<input
						bind:value={emailAddress}
						required
						placeholder="john@mail.com"
						name="User Email"
						type="email"
						class="inputInitial"
					/>
				</div>
				<div>
					<p class="mb-2 ">{$t("amount")}</p>
					<input
						required
						autocomplete="off"
						bind:value={amount}
						placeholder="EUR"
						name="Amount"
						type="number"
						maxlength="10000"
						class="inputInitial"
					/>
				</div>
				<div class="space-y-4 text-xs">
					<div class="flex items-center ">
						<input type="checkbox" class="checkbox" required />
						<p class="ml-2 ">
							{$t("termsSuffix")}<a href="#" class="font-medium underline"
								>{$t("terms")}</a
							>.
						</p>
					</div>
					<div class="flex items-center ">
						<input type="checkbox" class="checkbox" required />
						<p class="ml-2 ">
							{$t("blockchainWarning")}
						</p>
					</div>
				</div>
				<div class="py-4 px-4 bg-mainbg border border-borderColor w-full">
					<p class="opacity-70 font-semibold">Disclaimer:</p>
					<p class="opacity-70 mt-1">You will be redirected to a payment processor to confirm the transaction. The amount entered in EUR (€) will be converted to USD.</p>
				</div>
				<div
					class="my-4 mt-12 inline-flex md:absolute md:bottom-4 md:left-4 md:my-0"
				>
					<button
						class="buttonBig overflow-hidden px-8 w-fit"
						>{$t("continueCTA")}
						
					</button>
				</div>
			</form>
		</div>
	</div>
	<div
		class="topoBg mt-12 flex w-full flex-col items-center justify-center py-14 md:mt-0 md:w-2/5"
	>
		<!-- {#if conversionRate !== 0} -->
		<!-- <img
			class="pointer-events-none aspect-square w-3/5 md:w-2/5 "
			src="https://api.qrserver.com/v1/create-qr-code/?data=bitcoin:{$btcAddress}?amount={amountInBtc}&color=E4E5E8&bgcolor=242733"
			alt="QR Code"
		/>
		<p class="text-darkgray pt-10 text-xs text-white opacity-50">
			BASE58 (P2PKH)
		</p>
		<div class="flex items-center py-2">
			<button on:click={copyToClipboard} class="mr-2 hidden md:block">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="delay-750 h-5 w-5  opacity-70 transition hover:opacity-100 
							{clicked == 'successful' ? 'stroke-gain opacity-100' : 'stroke-white'}"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
					/>
				</svg>
			</button>
			<p class="text-darkgray font-medium text-white">
				{$btcAddress}
			</p>
		</div>
		<div class="mt-10 flex w-64 items-center justify-between bg-mainbg text-sm">
			<p class="mr-2 bg-white py-1.5 px-3 text-xs text-secondarybg">
				{$t("amount")}
			</p>
			<p class="px-2 text-white ">{amountInBtc} BTC</p>
		</div>
		<div class="mt-2 flex w-64 items-center justify-between bg-mainbg text-sm">
			<p class="mr-2 bg-white py-1.5 px-3 text-xs text-secondarybg">
				{$t("localCurrency")}
			</p>
			<p class="px-2 text-white ">{amountEur} EUR</p>
		</div> -->
		<!-- {/if} -->
	</div>
</div>
