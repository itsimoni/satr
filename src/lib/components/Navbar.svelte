<script lang="ts">
	import SpanishFlagSvg from "$lib/components/navbar/SpanishFlagSvg.svelte";
	import OutClick from "svelte-outclick";
	import { nav } from "$lib/stores/nav";
	import {
		live,
		selectedLanguage,
		userAddress,
		userSurname,
		userName,
		userCity,
		userCountry,
	} from "$lib/stores/store";
	export let invested = 1;
	export let current = 1;

	import { t, locale, locales } from "$lib/services/i18n";
	import { afterNavigate, goto } from "$app/navigation";
	import supabase from "$lib/db";
	import { onMount } from "svelte";
	import { toFixedNr } from "$lib/logic/arbitrageLogic";
	import Logo from "$lib/Logo.svelte";

	let fundingDropdown = false;
	function toggleFundingDropdown() {
		accountDropdown = false;
		ledgerDropdown = false;
		langDropdown = false;
		fundingDropdown = !fundingDropdown;
	}

	let ledgerDropdown = false;
	function toggleLedgerDropdown() {
		accountDropdown = false;
		fundingDropdown = false;
		langDropdown = false;
		ledgerDropdown = !ledgerDropdown;
	}

	let langDropdown = false;
	function toggleLangDropdown() {
		fundingDropdown = false;
		ledgerDropdown = false;
		accountDropdown = false;
		langDropdown = !langDropdown;
	}

	let accountDropdown = false;
	function toggleAccountDropdown() {
		fundingDropdown = false;
		ledgerDropdown = false;
		langDropdown = false;
		accountDropdown = !accountDropdown;
	}

	// function exitLedgerDropdownOutside() {
	// 	fundingDropdown = false;
	// 	langDropdown = false;
	// 	ledgerDropdown = !ledgerDropdown;
	// }

	// function exitLangDropdownOutside() {
	// 	fundingDropdown = false;
	// 	ledgerDropdown = false;
	// 	langDropdown = !langDropdown;
	// }

	function selectEnglish() {
		if ($selectedLanguage == "English") {
			exitDropdowns();
		}
		$locale = "en";
		exitDropdowns();
	}
	function selectItalian() {
		if ($selectedLanguage == "Italian") {
			exitDropdowns();
		}
		$locale = "it";
		exitDropdowns();
	}
	function selectSpanish() {
		if ($selectedLanguage == "Spanish") {
			exitDropdowns();
		}
		$locale = "es";
		exitDropdowns();
	}
	function selectGerman() {
		if ($selectedLanguage == "German") {
			exitDropdowns();
		}
		$locale = "de";
		exitDropdowns();
	}

	export const exitDropdowns = () => {
		fundingDropdown = false;
		langDropdown = false;
		ledgerDropdown = false;
		// accountDropdown = false;
	};

	function exitAllDropdowns() {
		exitDropdowns();
	}

	async function signOut() {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error(error);
		}
	}

	let open = false;

	const manageMenu = () => {
		open = !open;
		scrollable = !scrollable;
	};

	function manageNotifications() {
		if (open) open = !open;
	}

	let scrollable = true;
	const wheel = (node, options) => {
		let { scrollable } = options;

		const handler = (e) => {
			if (!scrollable) e.preventDefault();
		};

		node.addEventListener("wheel", handler, { passive: false });

		return {
			update(options) {
				scrollable = options.scrollable;
			},
			destroy() {
				node.removeEventListener("wheel", handler, {
					passive: false,
				});
			},
		};
	};

	function clickLink() {
		open = false;
	}

	afterNavigate(() => {
		clickLink();
		exitDropdowns();
	});

	async function calculateConversionRate() {
		let values = [];
		let value;
		fetch(`https://blockchain.info/tobtc?currency=EUR&value=1`)
			.then((response) => response.json())
			.then((response) => {
				conversionRate = response;
			});
	}

	onMount(() => calculateConversionRate());

	let conversionRate = 0;
	$: amountInBTC = invested / conversionRate;
</script>

<!-- mobile -->
<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-invalid-attribute -->
<div
	class="flex items-center justify-between bg-mainbg p-4 text-white lg:hidden"
>
	<a
		href={$nav.trade}
		class="z-[60] mt-0.5 h-4 font-semibold text-main"
		rel="external"
	>
		<Logo classNames="h-full" />
	</a>
	<!-- MENU BAR -->
	<div class="flex items-center font-inter">
		<a class="mr-2 text-xs" href="#">
			<span class="mr-1 text-sm font-semibold"
				>{toFixedNr(invested, 5)} BTC</span
			>Current
		</a>

		<div class="noSelect z-[60] flex h-10 space-x-3">
			<div on:click={manageMenu} class="z-30">
				<button class="relative -z-30 w-6 text-white focus:outline-none">
					<span class="sr-only">Open main menu</span>
					<div
						class="absolute left-1/2 top-1/2 block w-5 -translate-x-1/2 -translate-y-1/2 transform"
					>
						<span
							aria-hidden="true"
							class="{!open
								? '-translate-y-1.5'
								: 'rotate-45'} absolute block h-0.5 w-5 transform bg-white transition duration-500 ease-in-out"
						/>
						<span
							aria-hidden="true"
							class="absolute block h-0.5 w-5 transform bg-white transition duration-500 ease-in-out"
							class:opacity-0={open}
						/>
						<span
							aria-hidden="true"
							class="{!open
								? 'translate-y-1.5'
								: '-rotate-45'} absolute block h-0.5 w-5 transform bg-white transition  duration-500 ease-in-out"
						/>
					</div>
				</button>
			</div>
		</div>

		<div
			on:click={manageMenu}
			style="touch-action: none;"
			class="fixed top-0 bottom-0 right-0 left-0 z-50 flex h-screen w-full flex-col items-center justify-center space-y-6 overflow-x-hidden overflow-y-hidden bg-mainbg pb-6 font-inter"
			class:hidden={!open}
		>
			<a on:click={clickLink} href={$nav.trade} class="mobileNavLink">
				{$t("navTrade")}
			</a>
			<a on:click={clickLink} href={$nav.bot} class="mobileNavLink">
				{$t("navCryptoBot")}
			</a>
			<a on:click={clickLink} href={$nav.deposit} class="mobileNavLink">
				{$t("navDeposit")}
			</a>
			<a on:click={clickLink} href={$nav.withdraw} class="mobileNavLink">
				{$t("navWithdrawRequest")}
			</a>
			<a on:click={clickLink} href={$nav.withdrawHistory} class="mobileNavLink">
				{$t("navWithdrawHistory")}
			</a>
			<a on:click={clickLink} href={$nav.transactions} class="mobileNavLink">
				{$t("navTransactionHistory")}
			</a>
			<a on:click={clickLink} href={$nav.tradeHistory} class="mobileNavLink">
				{$t("navTradeHistory")}
			</a>

			<div class="flex items-center space-x-2 pt-6">
				<div on:click={selectEnglish}>
					<svg
						class="w-7"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 7410 3900"
						><path fill="#b22234" d="M0 0h7410v3900H0z" /><path
							d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0"
							stroke="#fff"
							stroke-width="300"
						/><path fill="#3c3b6e" d="M0 0h2964v2100H0z" /><g fill="#fff"
							><g id="d"
								><g id="c"
									><g id="e"
										><g id="b"
											><path
												id="a"
												d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z"
											/><use xlink:href="#a" y="420" /><use
												xlink:href="#a"
												y="840"
											/><use xlink:href="#a" y="1260" /></g
										><use xlink:href="#a" y="1680" /></g
									><use xlink:href="#b" x="247" y="210" /></g
								><use xlink:href="#c" x="494" /></g
							><use xlink:href="#d" x="988" /><use
								xlink:href="#c"
								x="1976"
							/><use xlink:href="#e" x="2470" /></g
						></svg
					>
				</div>

				<div on:click={selectItalian}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-7"
						viewBox="0 0 1527.999 1018.889"
					>
						<g
							id="Group_145"
							data-name="Group 145"
							transform="translate(-13646.334 -1573)"
						>
							<rect
								id="Rectangle_197"
								data-name="Rectangle 197"
								width="509.333"
								height="1018.889"
								transform="translate(13646.334 1573)"
								fill="#008c45"
							/>
							<rect
								id="Rectangle_198"
								data-name="Rectangle 198"
								width="509.333"
								height="1018.889"
								transform="translate(14155.667 1573)"
								fill="#fff"
							/>
							<rect
								id="Rectangle_199"
								data-name="Rectangle 199"
								width="509.333"
								height="1018.889"
								transform="translate(14665 1573)"
								fill="#cd212a"
							/>
						</g>
					</svg>
				</div>
				<div on:click={selectSpanish}>
					<SpanishFlagSvg width={7} />
				</div>
				<div on:click={selectGerman}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" class="w-7"
						><path d="M0 0h5v3H0z" /><path fill="#D00" d="M0 1h5v2H0z" /><path
							fill="#FFCE00"
							d="M0 2h5v1H0z"
						/></svg
					>
				</div>
			</div>
			<a on:click={clickLink} href={$nav.account} class="mobileNavSecondary">
				{$userName}
				{$userSurname}
			</a>
			<a on:click={signOut} href="#" class="block text-sm">Log Out</a>
		</div>
	</div>
</div>

<!-- desktop -->
<div
	class="hidden items-center justify-between border-b border-borderColor bg-mainbg p-4 font-inter text-sm text-white lg:flex"
>
	<OutClick on:outclick={exitAllDropdowns}>
		<div class="flex items-center space-x-4">
			<!-- {#key $pageOpened} -->
			<a
				href={$nav.trade}
				class="mt-0.5 h-4 font-semibold text-main"
				rel="external"
			>
				<Logo classNames="h-full" />
			</a>
			<!-- {/key} -->
			<a href={$nav.trade} class="" rel="external">{$t("navTrade")}</a>
			<a href={$nav.bot} class="">{$t("navCryptoBot")}</a>
			<div class="relative">
				<button
					id="dropdownDefault"
					data-dropdown-toggle="dropdown"
					on:click={toggleFundingDropdown}
					class="inline-flex items-center"
					type="button"
					>{$t("navFunding")}
					<svg
						class="ml-1 h-4 w-4"
						fill={!fundingDropdown ? "none" : "#E4E5E8"}
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						/></svg
					></button
				>
				<!-- Dropdown menu -->
				<div
					class="{!fundingDropdown
						? 'hidden'
						: 'absolute top-9 right-1/2 block translate-x-1/2'} z-[1000] divide-y divide-borderColor whitespace-nowrap border border-borderColor bg-secondarybg text-center shadow"
				>
					<ul class="text-sm text-white" aria-labelledby="dropdownDefault">
						<li class="border-b border-borderColor">
							<a href={$nav.deposit} class="block px-4 py-2 hover:bg-gray-600 "
								>{$t("navDeposit")}</a
							>
						</li>

						<li class="border-y border-borderColor">
							<a
								href={$nav.withdraw}
								class="block px-4 py-2 hover:bg-gray-600 hover:text-white"
								>{$t("navWithdrawRequest")}</a
							>
						</li>
						<li class="border-t border-borderColor">
							<a
								href={$nav.withdrawHistory}
								class="block px-4 py-2 hover:bg-gray-600 hover:text-white"
								>{$t("navWithdrawHistory")}</a
							>
						</li>
					</ul>
				</div>
			</div>
			<div class="relative">
				<button
					id="dropdownDefault"
					data-dropdown-toggle="dropdown"
					on:click={toggleLedgerDropdown}
					class="inline-flex items-center"
					type="button"
					>{$t("navLedgerHistory")}
					<svg
						class="ml-1 h-4 w-4"
						fill={!ledgerDropdown ? "none" : "#E4E5E8"}
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						/></svg
					></button
				>
				<!-- Dropdown menu -->
				<div
					class="{!ledgerDropdown
						? 'hidden'
						: 'absolute top-9 right-1/2 block translate-x-1/2'} z-[1000] divide-y divide-borderColor whitespace-nowrap border border-borderColor bg-secondarybg text-center shadow"
				>
					<ul class="text-sm text-white" aria-labelledby="dropdownDefault">
						<li class="border-b border-borderColor">
							<a
								href={$nav.transactions}
								class="block px-4 py-2 hover:bg-gray-600 hover:text-white "
								>{$t("navTransactionHistory")}</a
							>
						</li>
						<li class="border-y border-borderColor">
							<a
								href={$nav.tradeHistory}
								class="block px-4 py-2 hover:bg-gray-600 hover:text-white"
								>{$t("navTradeHistory")}</a
							>
						</li>
					</ul>
				</div>
			</div>
			<div class="relative">
				<button
					id="dropdownDefault"
					data-dropdown-toggle="dropdown"
					on:click={toggleLangDropdown}
					class="inline-flex items-center"
					type="button"
					>{$t("navLanguage")}
					<svg
						class="ml-1 h-4 w-4"
						fill={!langDropdown ? "none" : "#E4E5E8"}
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						/></svg
					></button
				>
				<!-- Dropdown menu -->
				<div
					class="{!langDropdown
						? 'hidden'
						: 'absolute top-9 right-1/2 block translate-x-1/2'} z-[1000] w-40 divide-y divide-borderColor border border-borderColor bg-secondarybg text-center shadow"
				>
					<ul class="text-sm text-white" aria-labelledby="dropdownDefault">
						<li
							on:click={selectEnglish}
							class="flex items-center justify-between border-b  border-borderColor px-4 py-2 hover:bg-gray-600 hover:text-white"
						>
							<a href="#" class="block ">English</a>
							<svg
								class="w-8"
								xmlns="http://www.w3.org/2000/svg"
								xmlns:xlink="http://www.w3.org/1999/xlink"
								viewBox="0 0 7410 3900"
								><path fill="#b22234" d="M0 0h7410v3900H0z" /><path
									d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0"
									stroke="#fff"
									stroke-width="300"
								/><path fill="#3c3b6e" d="M0 0h2964v2100H0z" /><g fill="#fff"
									><g id="d"
										><g id="c"
											><g id="e"
												><g id="b"
													><path
														id="a"
														d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z"
													/><use xlink:href="#a" y="420" /><use
														xlink:href="#a"
														y="840"
													/><use xlink:href="#a" y="1260" /></g
												><use xlink:href="#a" y="1680" /></g
											><use xlink:href="#b" x="247" y="210" /></g
										><use xlink:href="#c" x="494" /></g
									><use xlink:href="#d" x="988" /><use
										xlink:href="#c"
										x="1976"
									/><use xlink:href="#e" x="2470" /></g
								></svg
							>
						</li>
						<li
							on:click={selectItalian}
							class="flex items-center justify-between border-y  border-borderColor px-4 py-2 hover:bg-gray-600 hover:text-white"
						>
							<a href="#" class="block ">Italian</a>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-8"
								viewBox="0 0 1527.999 1018.889"
							>
								<g
									id="Group_145"
									data-name="Group 145"
									transform="translate(-13646.334 -1573)"
								>
									<rect
										id="Rectangle_197"
										data-name="Rectangle 197"
										width="509.333"
										height="1018.889"
										transform="translate(13646.334 1573)"
										fill="#008c45"
									/>
									<rect
										id="Rectangle_198"
										data-name="Rectangle 198"
										width="509.333"
										height="1018.889"
										transform="translate(14155.667 1573)"
										fill="#fff"
									/>
									<rect
										id="Rectangle_199"
										data-name="Rectangle 199"
										width="509.333"
										height="1018.889"
										transform="translate(14665 1573)"
										fill="#cd212a"
									/>
								</g>
							</svg>
						</li>
						<li
							on:click={selectSpanish}
							class="flex items-center justify-between border-y  border-borderColor px-4 py-2 hover:bg-gray-600 hover:text-white"
						>
							<a href="#" class="block ">Spanish</a>
							<SpanishFlagSvg />
						</li>
						<li
							on:click={selectGerman}
							class="flex items-center justify-between border-t  border-borderColor px-4 py-2 hover:bg-gray-600 hover:text-white"
						>
							<a href="#" class="block ">German</a>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 5 3"
								class="w-8"
								><path d="M0 0h5v3H0z" /><path
									fill="#D00"
									d="M0 1h5v2H0z"
								/><path fill="#FFCE00" d="M0 2h5v1H0z" /></svg
							>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</OutClick>
	<div class="flex space-x-4">
		{#if $live === undefined}
			<p class="cursor-pointer font-semibold">Loading</p>
		{/if}
		{#if $live !== undefined}
			<p class="cursor-pointer font-semibold">
				{!$live ? $t("demoMode") : $t("liveMode")}
			</p>
		{/if}
		{#if conversionRate == 0}
			<a class="text-xs" href="#"
				><span class="mr-1 text-sm font-semibold">Calculating BTC</span
				>Balance</a
			>
		{/if}
		{#if conversionRate !== 0}
			<a class="text-xs" href="#"
				><span class="mr-1 text-sm font-semibold"
					>{toFixedNr(amountInBTC, 2)} EUR</span
				>Approx. Balance</a
			>
		{/if}
		<a class="text-xs" href="#"
			><span class="mr-1 text-sm font-semibold"
				>{toFixedNr(invested, 3)} BTC</span
			>Balance</a
		>
		{#if $userName == ""}
			<a on:click={signOut} href="#" class="block text-sm">Log Out</a>
		{/if}
		{#if $userName !== ""}
			<div class="relative">
				<button
					id="dropdownDefault"
					data-dropdown-toggle="dropdown"
					on:click={toggleAccountDropdown}
					class="inline-flex items-center"
					type="button"
				>
					{$userName}
					{$userSurname}
				</button>
				<!-- Dropdown menu -->
				<div
					class="{!accountDropdown
						? 'hidden'
						: 'absolute top-9 right-0 block'} z-[1000] w-40 divide-y divide-borderColor border border-borderColor bg-secondarybg text-right"
				>
					<ul class="text-sm text-white" aria-labelledby="dropdownDefault">
						<li
							class="flex items-center justify-between border-b  border-borderColor px-4 py-2 hover:bg-gray-600 hover:text-white"
						>
							{#if $userAddress !== "Your Address"}
								<div class="w-full cursor-pointer flex-col items-end py-2">
									<p class="block  whitespace-nowrap ">
										{$userName}
										{$userSurname}
									</p>
									<p class="mt-1 block text-xs">{$userCity}, {$userCountry}</p>
								</div>
							{/if}
							{#if $userAddress === "Your Address"}
								<div class="flex w-full cursor-pointer justify-end py-2">
									<p class="block whitespace-nowrap">
										{$userName}
										{$userSurname}
									</p>
								</div>
							{/if}
						</li>
						<li
							class="flex items-center justify-end  border-y  border-borderColor px-4 py-2 hover:bg-gray-600 hover:text-white"
						>
							<a href={$nav.account} class="block">My Profile</a>
						</li>
						<li
							class="flex items-center justify-end border-y  border-borderColor px-4 py-2 hover:bg-gray-600 hover:text-white"
						>
							<a href={$nav.reset} class="block">Change Password</a>
						</li>
						<li
							on:click={signOut}
							class="flex items-center justify-end border-t  border-borderColor px-4 py-2 hover:bg-gray-600 hover:text-white"
						>
							<a href="#" class="block ">Log Out</a>
						</li>
					</ul>
				</div>
			</div>
		{/if}
	</div>
</div>
