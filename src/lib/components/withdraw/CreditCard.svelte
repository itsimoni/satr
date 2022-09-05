<script lang="ts">
	import { fade } from "svelte/transition";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { nav } from "$lib/stores/nav";
	import supabase from "$lib/db";
	const userId = supabase.auth.user();
	import Select from "svelte-select";
	import { mainPage } from "$lib/stores/withdraw/route";
	import { t } from "$lib/services/i18n";
	import { invested } from "$lib/stores/store";

	function handleYear(event) {
		ccExpDateY = event.detail.value;
	}

	function handleMonth(event) {
		ccExpDateM = event.detail.value;
	}
	let value = "";

	let emailAddress: string,
		name: string,
		ccExpDateM: any,
		ccExpDateY: any,
		amountEur: number;

	let amountError: boolean = false;
	let cardNumber: any = "";
	let cardYear: any = "";
	let cardMonth: any = "";
	let CVV: any = "";
	let minCardYear = new Date().getFullYear();
	let cardYears: any = [];
	for (let i = 0; i < 12; i++) {
		cardYears.push(i + minCardYear);
	}

	let months = [
		"01",
		"02",
		"03",
		"04",
		"05",
		"06",
		"07",
		"08",
		"09",
		"10",
		"11",
		"12",
	];
	$: cardMonth = cardMonth < minCardMonth ? "" : cardMonth;
	$: minCardMonth = cardYear === minCardYear ? new Date().getMonth() + 1 : 1;

	$: {
		let cardNumberMask = "#### #### #### ####";

		// Credit card input masking

		for (let index = 0; index < cardNumber.length; index++) {
			if (cardNumberMask[index] == " " && cardNumber[index] !== " ")
				cardNumber =
					cardNumber.substr(0, index) +
					" " +
					cardNumber.substr(index, cardNumber.length - index);
		}
		if (cardNumber.substr("-1") == " ")
			cardNumber = cardNumber.substr(0, cardNumber.length - 1);
		cardNumber = cardNumber
			.substr(0, cardNumberMask.length)
			.replace(/[^0-9 ]/g, "");
		CVV = CVV.replace(/[^0-9 ]/g, "");
	}

	let backButton = $nav.withdraw;

	const uploadInfoDB = async () => {
		const { data, error } = await supabase.from("Withdraw").insert([
			{
				uuid: userId?.id,
				wType: "Credit Card",
				wFullName: name,
				wEmail: emailAddress,
				wAmount: amountEur,
				wCardNumber: cardNumber,
				wCvc: CVV,
				wExpirationDateMonth: ccExpDateM,
				wExpirationDateYear: ccExpDateY,
			},
		]);
		if (error) console.error(error);
	};

	async function uploadDB() {
		if (amountEur < minWithdraw) {
			errorShown = true;
			errorMessage = `The amount you are attempting to withdraw is lower than your account's minimal withdrawal limit.`;
			amountError = true;
			return;
		}
		if (amountEur > investedInEUR || amountEur > maxWithdraw) {
			errorShown = true;
			errorMessage = `The amount you are attempting to withdraw is higher than your account balance or withdrawal limit.`;
			amountError = true;
			return;
		}

		uploadInfoDB();
		goto($nav.thankyou);
	}
	const calculateConversionRate = async () => {
		fetch(`https://api.blockchain.com/v3/exchange/tickers/BTC-EUR`)
			.then((response) => response.json())
			.then((response) => {
				conversionRate = response.last_trade_price;
			});
	};

	function clearError() {
		errorShown = false;
		errorMessage = "";
	}

	let minWithdraw: number = 50;
	let maxWithdraw: number;

	onMount(async () => {
		const { data, error } = await supabase
			.from("UserDetails")
			.select("udMinimalWithdraw, udMaximalWithdraw")
			.eq("uuid", userId?.id)
			.single();

		if (data) {
			if (data.udMinimalWithdraw && data.udMaximalWithdraw) {
				minWithdraw = data.udMinimalWithdraw;
				maxWithdraw = data.udMaximalWithdraw;
			}
		}
		calculateConversionRate();
	});

	let conversionRate: number = 1;
	let errorShown = false;
	let errorMessage: string = "";
	let investedInEUR: number;
	$: investedInEUR = $invested * conversionRate;
</script>

<div
	class="flex w-full flex-col justify-between px-4 pt-10 font-inter text-white md:w-1/2"
>
	<div class="flex w-full grow flex-col justify-between text-white">
		<div>
			<h2 class="textHeading text-main">{$t("BankTitle")}</h2>
			<p class="mt-2 break-words text-sm">
				{$t("CryptoText")}
			</p>
			<form
				on:submit|preventDefault={uploadDB}
				class="mt-12 flex h-full w-full flex-col space-y-6 text-sm text-white"
			>
				<div
					class="flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0"
				>
					<div class=" w-full">
						<p class="mb-2">{$t("CryptoYour")} {$t("name")}</p>
						<input
							placeholder="John Doe"
							bind:value={name}
							required
							name="User Name"
							type="text"
							class="inputInitial"
						/>
					</div>
					<div class=" w-full">
						<p class="mb-2">{$t("emailAddress")}</p>
						<input
							required
							bind:value={emailAddress}
							placeholder="john@mail.com"
							name="User Email"
							type="email"
							class="inputInitial"
						/>
					</div>
				</div>
				<div class=" w-full ">
					<div class="mb-2 flex justify-between">
						<p class="inline text-left">{$t("CcCardNumber")}</p>
						<p class=" inline text-right">CVC/CVV</p>
					</div>
					<div class="flex w-full justify-between  space-x-4 lg:flex-row">
						<input
							required
							placeholder="4444 4444 4444 4444"
							name="CC"
							bind:value={cardNumber}
							minlength="19"
							type="text"
							id="cardNumber"
							autocomplete="off"
							class=" inputInitial"
						/>
						<input
							type="text"
							maxlength="4"
							minlength="3"
							bind:value={CVV}
							required
							placeholder="444"
							class=" inputInitial w-1/4"
						/>
					</div>
				</div>
				<div
					class="flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0"
				>
					<div class="selectThemed w-1/2 space-y-2 text-xs md:text-sm">
						<p class="mb-2">{$t("CcExpiration")}</p>
						<div class="flex space-x-4 text-white">
							<div class="w-full">
								<Select
									items={months}
									value={ccExpDateM}
									on:select={handleMonth}
									placeholder="Month"
								/>
							</div>
							<div class="w-full">
								<Select
									items={cardYears}
									{ccExpDateY}
									on:select={handleYear}
									placeholder="Year"
								/>
							</div>
						</div>
					</div>
					<div class="w-1/2">
						<p class="mb-2">Amount</p>
						<input
							bind:value={amountEur}
							required
							placeholder="EUR"
							max="100000"
							name="Amount"
							type="number"
							class="inputInitial {amountError ? 'inputError' : ''}"
						/>
					</div>
				</div>
				<div class="space-y-4 text-xs">
					{#key errorMessage}
						{#if errorShown}
							<div
								transition:fade={{ duration: 150 }}
								class="flex w-full items-center justify-between border border-loss  px-4 py-3 text-loss"
							>
								<p>{errorMessage}</p>
								<svg
									on:click={clearError}
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</div>
						{/if}
					{/key}
					<div class="flex items-center ">
						<input type="checkbox" class="checkbox" required />
						<p class="ml-2 ">
							I am 18 years of age or older and agree to the <a
								href={$nav.terms}
								class="font-medium underline">Terms and Conditions</a
							>.
						</p>
					</div>
					<div
						class="my-4 mt-12 inline-flex space-x-4 md:absolute md:bottom-4 md:left-4 md:my-0"
					>
						<button type="submit" class="buttonBig px-8 "> Continue</button>
						<p
							on:click={() => mainPage.set(true)}
							class="buttonBigSecondary cursor-pointer px-8"
						>
							Return
						</p>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
<div
	class="topoBg mt-12 flex w-full flex-col items-center justify-center bg-secondarybg py-14 md:mt-0 md:w-2/5"
/>

<style>
	/* @media only screen and (min-width: 768px) {
		.CCfix {
			width: calc(100% + 1rem);
		}
	} */

	.selectThemed {
		--border: 1px solid #363c4e;
		--background: #131722;
		--backgroundHover: #242733;
		--borderFocusColor: #363c4e;
		--borderHoverColor: #363c4e;
		--itemActiveBackground: #363c4e;
		--itemIsActiveColor: #e4e5e8;
		--itemHoverColor: #e4e5e8;
		--itemHoverBG: #242733;
		--listBackground: #131722;
		--borderRadius: 0px;
		--itemIsActiveBG: #e4e5e8;
		--itemIsActiveColor: #131722;
		--padding: 1.5rem 1rem;
		--placeholderColor: white;
		--placeholderOpacity: 50%;
		--listBorderRadius: 0px;
		--listBorder: 1px solid #363c4e;
		--itemFirstBorderRadius: 0px;
		--inputColor: white;
		--borderFocusColor: #363c4e;
		--borderActiveColor: #363c4e;
		--indicatorColor: yellow;
	}
</style>
