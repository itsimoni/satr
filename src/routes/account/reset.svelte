<script lang="ts">
	import { goto } from "$app/navigation";
	import { fade } from "svelte/transition";

	import { t } from "$lib/services/i18n";
	import { nav } from "$lib/stores/nav";
	import { companyName } from "$lib/stores/store";
	import supabase from "$lib/db";

	// const { user: us } = get(session);

	let firstPass: string = "";
	let secondPass: string = "";

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
	let visibilityFirst: boolean = false;
	let visibilitySecond: boolean = false;

	let typeFirst = "password";
	let typeSecond = "password";

	const toggleVisibilityFirst = () => {
		if (typeFirst == "password") {
			visibilityFirst = false;
			typeFirst = "text";
		} else {
			visibilityFirst = true;
			typeFirst = "password";
		}
	};

	const toggleVisibilitySecond = () => {
		if (typeSecond == "password") {
			visibilitySecond = false;
			typeSecond = "text";
		} else {
			visibilitySecond = true;
			typeSecond = "password";
		}
	};

	let errorMessage: string = "";
	let errorShown: boolean = false;

	async function submitReset() {
		const userId = supabase.auth.user();
		errorShown = false;
		if (firstPass !== secondPass) {
			errorMessage = `Passwords don't match. Please check again`;
			errorShown = true;
			return;
		}
		if (firstPass.length < 8 && secondPass.length < 8) {
			errorMessage = `Please use 8 or more characters in your password.`;
			errorShown = true;
			return;
		}
		const { data, error } = await supabase
			.from("Users")
			.update({ uPassword: firstPass })
			.eq('uuid', userId?.id);
		if (error) {
			errorMessage =
				"Unfortunately, we were unable to update your password at this moment. Please try again later.";
			errorShown = true;
			return;
		}
		const { user, error: err } = await supabase.auth.update({
			password: firstPass,
		});
		if (err) {
			errorMessage =
				"Unfortunately, we were unable to update your password at this moment. Please try again later.";
			errorShown = true;
			return;
		}
		goto($nav.thankyou);
	}

	function clearError() {
		errorShown = false;
		errorMessage = "";
	}
</script>

<title>Reset Password - {$companyName}</title>
<div
	class="flex h-full grow flex-col justify-between bg-mainbg font-inter md:flex-row "
>
	<div
		class="flex h-[95vh] w-full flex-col justify-between px-4 pt-10 md:w-1/2"
	>
		<div>
			<h2 class="textHeading ">{$t("resetHeading")}</h2>
			<p class="break-words" />
			<form
				on:submit|preventDefault={submitReset}
				class="mt-12 lg:h-full lg:justify-between text-white"
				autocomplete="false"
			>
				<input type="text" autocomplete="false" class="hidden" />
				<div class="space-y-6">
					<div>
						<p class="mb-2">{`${$t("new")} ${$t("password")}`}</p>
						<div class="relative flex items-center">
							{#if typeFirst === "password"}
								<input
									type="password"
									bind:value={firstPass}
									class="inputInitial"
									placeholder={$t("password")}
								/>
							{:else if typeFirst === "text"}
								<input
									type="text"
									bind:value={firstPass}
									class="inputInitial"
									placeholder={$t("password")}
								/>
							{/if}
							<svg
								on:click={toggleVisibilityFirst}
								xmlns="http://www.w3.org/2000/svg"
								class="absolute right-4 h-5 w-5 {visibilityFirst
									? 'hidden'
									: 'block'} transition delay-75"
								fill="none"
								viewBox="0 0 24 24"
								stroke={"white"}
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
								/>
							</svg>
							<svg
								on:click={toggleVisibilityFirst}
								xmlns="http://www.w3.org/2000/svg"
								class="absolute right-4 h-5 w-5 {visibilityFirst
									? 'block'
									: 'hidden'} transition delay-75"
								fill="none"
								viewBox="0 0 24 24"
								stroke={"white"}
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
								/>
							</svg>
						</div>
					</div>
					<div>
						<p class="mb-2">
							{`${$t("confirm")} ${$t("new")} ${$t("password")}`}
						</p>
						<div class="relative flex items-center">
							{#if typeSecond === "password"}
								<input
									type="password"
									bind:value={secondPass}
									class="inputInitial"
									placeholder={$t("password")}
								/>
							{:else if typeSecond === "text"}
								<input
									type="text"
									bind:value={secondPass}
									class="inputInitial"
									placeholder={$t("password")}
								/>
							{/if}
							<svg
								on:click={toggleVisibilitySecond}
								xmlns="http://www.w3.org/2000/svg"
								class="absolute right-4 h-5 w-5 {visibilitySecond
									? 'hidden'
									: 'block'} transition delay-75"
								fill="none"
								viewBox="0 0 24 24"
								stroke={"white"}
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
								/>
							</svg>
							<svg
								on:click={toggleVisibilitySecond}
								xmlns="http://www.w3.org/2000/svg"
								class="absolute right-4 h-5 w-5 {visibilitySecond
									? 'block'
									: 'hidden'} transition delay-75"
								fill="none"
								viewBox="0 0 24 24"
								stroke={"white"}
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
								/>
							</svg>
						</div>
						<div class="my-6 space-y-4 text-sm ">
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
							<div class="flex items-center ">
								<p class="text-xs">
									{$t("resetPasswordWarning")}.
								</p>
							</div>
						</div>
						<div
							class="lg:absolute lg:bottom-4 my-4  lg:mt-12 mt-48 inline-flex space-x-4 lg:left-4 md:my-0"
						>
							<button type="submit" class="buttonBig px-8"
								>{$t("continue")}</button
							>
							<button
								type="reset"
								class="buttonBigSecondary whitespace-nowrap px-8"
								>{$t("clearInput")}</button
							>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
	<div
		class="topoBg mt-12 flex w-full flex-col items-center justify-center bg-secondarybg py-14 md:mt-0 md:w-2/5"
	/>
</div>
