<script lang="ts">
	import { fade } from "svelte/transition";
	import { goto } from "$app/navigation";
	import { nav } from "$lib/stores/nav";
	import Select from "svelte-select";
	import { countryList } from "$lib/stores/countryDataset";
	import { mainPage } from "$lib/stores/withdraw/route";
	import supabase from "$lib/db";
	import { t } from "$lib/services/i18n";
	import { onMount } from "svelte";
	import { invested } from "$lib/stores/store";
	const userId = supabase.auth.user();

	let name: string,
		emailAddress: string,
		IBAN: string,
		SWIFT: string,
		amountEur: any,
		beneficiaryBank: string,
		bankCountry: string,
		bankAddress: string;
	let amountError: boolean = false;

	let route;
	let selected = 1;
	let activePage = "";
	let errorShown = false;
	let errorMessage: string = "";

	function handleCountry(event) {
		bankCountry = event.detail.value;
	}

	let backButton = $nav.withdraw;

	const uploadInfoDB = async () => {
		const { data, error } = await supabase.from("Withdraw").insert([
			{
				uuid: userId?.id,
				wType: "Bank Transfer",
				wFullName: name,
				wEmail: emailAddress,
				wIban: IBAN,
				wSwift: SWIFT,
				wBankName: beneficiaryBank,
				wAmount: amountEur,
				wBankCountry: bankCountry,
				wBankAddress: bankAddress,
			},
		]);
		if (error) console.error(error);
	};

	let conversionRate: number = 1;

	const calculateConversionRate = async () => {
		fetch(`https://api.blockchain.com/v3/exchange/tickers/BTC-EUR`)
			.then((response) => response.json())
			.then((response) => {
				conversionRate = response.last_trade_price;
			});
	};

	async function uploadDB() {
		if (bankCountry === undefined) {
			errorShown = true;
			errorMessage = `Please select the Country of Your Bank.`;
			return;
		}
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
		errorShown = false;
		uploadInfoDB();
		goto($nav.thankyou);
	}

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

	let investedInEUR: number;
	$: investedInEUR = $invested * conversionRate;
</script>

<div
	class="flex w-full flex-col justify-between px-4 pt-10 font-inter text-white md:w-1/2"
>
	<div class="flex w-full flex-col justify-between text-white">
		<div>
			<h2 class="textHeading text-main">{$t("BankTitle")}</h2>
			<p class="mt-2 break-words text-sm">
				{$t("BankText")}
			</p>
			<form
				on:submit|preventDefault={uploadDB}
				class="mt-12 flex w-full flex-col space-y-6 text-sm text-white"
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
						<p class="mb-2">IBAN</p>
						<input
							required
							bind:value={IBAN}
							placeholder="DE75512108001245126199"
							name="IBAN"
							type="text"
							class="inputInitial"
						/>
					</div>
					<div class=" w-full">
						<p class="mb-2">SWIFT</p>
						<input
							required
							bind:value={SWIFT}
							placeholder="DEUTDEFFXXX"
							name="SWIFT"
							type="text"
							class="inputInitial"
						/>
					</div>
				</div>
				<div
					class="flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0"
				>
					<div class=" w-full">
						<p class="mb-2">{$t("BankBeneficiary")}</p>
						<input
							placeholder="Your Bank"
							bind:value={beneficiaryBank}
							required
							name="Your Bank"
							type="text"
							class="inputInitial"
						/>
					</div>
					<div class="w-full">
						<p class="mb-2">{$t("amount")}</p>
						<input
							bind:value={amountEur}
							required
							placeholder="EUR"
							max="100000"
							min="0"
							name="Amount"
							type="number"
							class="inputInitial {amountError ? 'inputError' : ''}"
						/>
					</div>
				</div>
				<div
					class="flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0"
				>
					<div class="selectThemed w-full space-y-2 text-xs md:text-sm">
						<p class="mb-2">{$t("BankCountry")}</p>
						<div class="flex space-x-4 text-white">
							<div class="w-full">
								<Select
									items={countryList}
									value={bankCountry}
									on:select={handleCountry}
									placeholder={$t("BankCountry")}
								/>
							</div>
						</div>
					</div>

					<div class="w-full">
						<p class="mb-2">{$t("BankAddress")}</p>
						<input
							required
							bind:value={bankAddress}
							placeholder={$t("BankAddress")}
							name="Bank Address"
							type="text"
							class="inputInitial"
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
					<div class="flex items-center">
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
	class="topoBg mt-12 flex w-full flex-col items-center justify-center bg-secondarybg md:mt-0 md:w-2/5"
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
		--placeholderColor: #6f7880;
		--placeholderOpacity: 100%;
		--listBorderRadius: 0px;
		--listBorder: 1px solid #363c4e;
		--itemFirstBorderRadius: 0px;
		--inputColor: white;
		--borderFocusColor: #363c4e;
		--borderActiveColor: #363c4e;
		--indicatorColor: yellow;
	}
</style>
