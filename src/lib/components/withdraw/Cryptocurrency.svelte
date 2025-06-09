<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { nav } from "$lib/stores/nav";
	import { fade } from "svelte/transition";
	import supabase from "$lib/db";
	const userId = supabase.auth.user();
	const uploadInfoDB = async (amountThen: any = null) => {
		const { data, error } = await supabase.from("Withdraw").insert([
			{
				uuid: userId?.id,
				wFullName: name,
				wEmail: emailAddress,
				wType: "Cryptocurrency",
				wAmount: amount,
				wAmountThen: amountThen,
				wCryptoWallet: wallet,
				wCrypto: selected,
			},
		]);
		if (error) console.error(error);
	};
	import Btc from "svelte-cryptocurrency-icons/Btc.svelte";
	import Eth from "svelte-cryptocurrency-icons/Eth.svelte";
	import { invested } from "$lib/stores/store";
	import { cubicInOut, cubicOut } from "svelte/easing";
	import { mainPage } from "$lib/stores/withdraw/route";
	import { t } from "$lib/services/i18n";
	import { toFixedNr } from "$lib/logic/arbitrageLogic";

	let conversionRate: number = 1;
	let conversionRateEth: number = 1;
	let minWithdraw: number = 40;
	let maxWithdraw: number;
	let minWithdrawBTC: number;
	let maxWithdrawBTC: number;
	let minWithdrawETH: number;
	let maxWithdrawETH: number;

	const calculateConversionRate = async () => {
		fetch(`https://api.blockchain.com/v3/exchange/tickers/BTC-EUR`)
			.then((response) => response.json())
			.then((response) => {
				conversionRate = response.last_trade_price;
			});
	}
	async function calculateEthPrice() {
		fetch(`https://api.blockchain.com/v3/exchange/tickers/ETH-BTC`)
			.then((response) => response.json())
			.then((response) => {
				conversionRateEth = response.last_trade_price;
			});
	}
	onMount(async function () {
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
		calculateEthPrice();
	});

	let emailAddress: string, name: string, amount: any;
	let amountError: boolean = false;
	let selected: string = "";
	let investedEth = 0;

	let errorShown = false;
	let errorMessage: string = "";
	let amountPlaceholder = $t("wSelectCrypto");

	let backButton = $nav.withdraw;

	function selectBtc() {
		selected = "btc";
	}
	function selectEth() {
		selected = "eth";
	}

	let ethVariation = "";
	let btcVariation = "";

	$: if (selected == "eth") {
		if (amount > investedEth) {
			amountError = true;
		} 
		else {
			amountError = false;
		}
		ethVariation = "white";
		walletPlaceholder = "0xb794f5ea0ba39494ce839613fffba74279579268";
		amountPlaceholder = "ETH";
	}
	$: if (selected !== "btc" && selected !== "eth") {
		ethVariation = "";
		btcVariation = "";
		walletPlaceholder = $t("wSelectCrypto");
		amountPlaceholder = $t("wSelectCrypto");
	}
	$: if (selected == "btc") {
		if (amount > $invested) {
			amountError = true;
		} else {
			amountError = false;
		}
		btcVariation = "white";
		walletPlaceholder = "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5";
		amountPlaceholder = "BTC";
	}

	let availableBalance = 0;
	$: availableBalance = $invested * conversionRate;

	function clearError() {
		errorShown = false;
		errorMessage = "";
	}

	function validate(evt: any) {
		var theEvent = evt || window.event;

		// Handle paste
		if (theEvent.type === "paste") {
			key = event.clipboardData.getData("text/plain");
		} else {
			// Handle key press
			var key = theEvent.keyCode || theEvent.which;
			key = String.fromCharCode(key);
		}
		var regex = /[0-9]|\./;
		if (!regex.test(key)) {
			theEvent.returnValue = false;
			if (theEvent.preventDefault) theEvent.preventDefault();
		}
	}

	let walletPlaceholder = $t("wSelectCrypto");
	let wallet: string = "";
	let amountThen: number = 0;
	let amountThenBtc:number = 0;
	let amountThenEth:number = 0;

	$: investedEth = $invested / conversionRateEth;
	$: minWithdrawBTC = minWithdraw / conversionRate;
	$: maxWithdrawBTC = maxWithdraw / conversionRate;

	$: minWithdrawETH = minWithdrawBTC / conversionRateEth;
	$: maxWithdrawETH = maxWithdrawBTC / conversionRateEth;

	async function uploadDB() {
		if (amount === undefined) {
			errorShown = true;
			errorMessage = `Please insert a valid amount.`;
			return;
		}
		if (selected == "btc") {
			if (amount > $invested || amount > maxWithdrawBTC) {
				errorShown = true;
				errorMessage = `The amount you are attempting to withdraw is higher than your account balance or withdrawal limit.`;
				amountError = true;
				return;
			}
			if (amount < minWithdrawBTC) {
				errorShown = true;
				errorMessage = `The amount you are attempting to withdraw is lower than your account's minimal withdrawal limit.`;
				amountError = true;
				return;
			} else {
				amountError = false;
				errorShown = false;
			}
		}
		if (selected == "eth") {
			if (amount > investedEth || amount > maxWithdrawETH) {
				errorShown = true;
				errorMessage = `The amount you are attempting to withdraw is higher than your account balance or withdrawal limit.`;
				amountError = true;
				return;
			}
			if (amount < minWithdrawETH) {
				errorShown = true;
				errorMessage = `The amount you are attempting to withdraw is lower than your account's minimal withdrawal limit.`;
				amountError = true;
				return;
			} else {
				amountError = false;
				errorShown = false;
			}
		}
		if (selected === undefined || selected == "") {
			errorShown = true;
			errorMessage = `Please select a cryptocurrency.`;
			return;
		}
		errorShown = false;
		uploadInfoDB(amountThen);
		goto($nav.thankyou);
	}

	$: (amount, selected), checkWhichAmount(amount);

	function checkWhichAmount(amountTot:number) { 
		amountThenBtc = amountTot * conversionRate;
		amountThenEth = amountThenBtc * conversionRateEth;
		if (selected == 'btc') {
			amountThen = amountThenBtc;
		}
		if (selected == 'eth') {
			amountThen = amountThenEth;
		}
		else return 0;
	}
</script>

<div
	class="flex w-full flex-col justify-between px-4 pt-10 font-inter text-white xl:w-2/3 2xl:w-1/2"
>
	<div class="flex w-full grow flex-col justify-between text-white ">
		<div>
			<h2 class="textHeading text-main">{$t("CryptoHeadLine")}</h2>
			<p class="mt-2 break-words text-sm">
				{$t("CryptoText")}
			</p>
			<div class="mt-10 border border-borderColor ">
				<div class=" flex w-full justify-between p-4">
					<div class="w-1/2">
						<h2 class="textHeadingSmall  text-white">
							{$t("CryptoCurrentBalance")}
						</h2>
					</div>
					<div class="flex flex-col justify-end text-right ">
						<div class="flex self-end text-right">
							<p
								class="textHeadingNumbersSmall whitespace-nowrap text-right text-main"
							>
								{toFixedNr($invested, 4)} BTC
							</p>
							{#if selected == "eth"}
								<div
									class="flex"
									transition:fade={{
										delay: 0,
										duration: 400,
										easing: cubicInOut,
									}}
								>
									<div class="mx-4 h-full w-1 bg-secondarybg" />
									<p
										class="textHeadingNumbersSmall whitespace-nowrap text-right text-main"
									>
										{toFixedNr(investedEth, 4)} ETH
									</p>
								</div>
							{/if}
						</div>
						<p class="mt-1 text-sm">~{toFixedNr(availableBalance, 2)} EUR</p>
					</div>
				</div>

				<div
					class="mt-2 flex flex-col bg-secondarybg bg-opacity-50 p-4 lg:flex-row lg:justify-between lg:space-x-4"
				>
					<div class="xl:w-1/2 ">
						<h2 class="font-medium">{$t("CryptoSelect")}</h2>
						<p class="mt-1 text-sm opacity-80">
							{$t("wMoreComingSoon")}
						</p>
					</div>

					<div
						class=" mt-4 flex items-center space-x-2 lg:mt-0 lg:space-x-4 xl:w-1/2"
					>
						<div
							class="flex w-full cursor-pointer items-center border bg-mainbg py-2.5 px-4 hover:bg-secondarybg {selected ==
							'btc'
								? `border-[#f7931a]`
								: 'border-borderColor'}"
							on:click={selectBtc}
						>
							<div class="mr-4 ml-2 flex items-center space-x-4">
								<div class="w-8">
									{#key btcVariation}
										<Btc />
									{/key}
								</div>
								<p>Bitcoin</p>
							</div>
						</div>
						<div
							class="flex w-full cursor-pointer items-center  border bg-mainbg py-2.5 px-4 hover:bg-secondarybg  {selected ==
							'eth'
								? `border-[#627eea]`
								: 'border-borderColor'}
							"
							on:click={selectEth}
						>
							<div class="mr-4 ml-2 flex items-center space-x-4">
								<div class="w-8">
									{#key ethVariation}
										<Eth />
									{/key}
								</div>
								<p>Ethereum</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<form
				on:submit|preventDefault={uploadDB}
				class="mt-6 flex w-full flex-col space-y-6 text-sm text-white"
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
				<div
					class="flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0"
				>
					<div class=" w-full">
						<p class="mb-2">{$t("CryptoAddress")}</p>
						<input
							required
							bind:value={wallet}
							placeholder={walletPlaceholder}
							disabled={selected == "" || selected == undefined}
							type="text"
							class="inputInitial"
						/>
					</div>
					<div class="w-full">
						<p class="mb-2">{$t("amount")}</p>
						<input
							on:keypress={(event) => validate(event)}
							bind:value={amount}
							disabled={selected == "" || selected == undefined}
							required
							placeholder={amountPlaceholder}
							name="Amount"
							type="text"
							class="inputInitial {amountError ? 'inputError' : ''}"
						/>
					</div>
				</div>
				<div class="space-y-4 text-xs">
					{#key errorMessage}
						{#if errorShown}
							<div
								transition:fade={{ duration: 150 }}
								class="flex w-full items-center  justify-between border border-loss  px-4 py-3 text-loss"
							>
								<p>{errorMessage}</p>
								<svg
									on:click={clearError}
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="investedColor"
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
							{$t("CryptoTerms")}
							<!-- <a
								href={$nav.terms}
								class="font-medium underline">Terms and Conditions</a
							>. -->
						</p>
					</div>
					<div class="flex space-x-4">
						<button type="submit" class="buttonBig my-4 w-fit px-8">
							{$t("CryptoContinue")}
						</button>
						<p
							on:click={() => mainPage.set(true)}
							class="buttonBigSecondary my-4 w-fit cursor-pointer px-8"
						>
							{$t("CryptoReturn")}
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
