<script lang="ts">
	import {
		companyEmail,
		companyName,
		userSurname,
		userAddress,
		userCity,
		userEmail,
		userName,
		userZipCode,
		userCountry,
		userPhoneNumber,
	} from "$lib/stores/store";
	import { t } from "$lib/services/i18n";
	import { nav } from "$lib/stores/nav";
	import Select from "svelte-select";
	import { countryList } from "$lib/stores/countryDataset";
	import supabase from "$lib/db";
	import { onMount } from "svelte";

	let userCreationDate = "";
	async function getUserCreationDate() {
		const userId = supabase.auth.user();
		const dateMS = await Date.parse(userId?.created_at);
		var s = new Date(dateMS).toLocaleDateString("en-US");
		userCreationDate = s;
	}

	function handleSelect(event) {
		value = event.detail.value;
	}

	onMount(async () => {
		getUserCreationDate();
	});

	let value = "";
	let phoneNumber: string;
	let firstName: string;
	let lastName: string;
	let emailAddress: string;
	let address: string;
	let city: string;
	let zipCode: string;

	function resetFields() {
		firstName = "";
		lastName = "";
		city = "";
		phoneNumber = "";
		address = "";
		zipCode = "";
		value = "";

		// ! NDAJ CA DO BESH ME ADDRESSEN
		emailAddress = "";
	}

	const updateUserInfo = async () => {
		const userId = supabase.auth.user();

		if (firstName) {
			const { data, error } = await supabase
				.from("Users")
				.update({ uFname: firstName })
				.match({ uuid: userId?.id });
			if (error) {
				console.error(error);
			}
		}
		if (lastName) {
			const { data, error } = await supabase
				.from("Users")
				.update({ uLname: lastName })
				.match({ uuid: userId?.id });
			if (error) {
				console.error(error);
			}
		}
		if (city) {
			const { data, error } = await supabase
				.from("UserDetails")
				.update({ udCity: city })
				.match({ uuid: userId?.id });
			if (error) {
				console.error(error);
			}
		}
		if (phoneNumber) {
			const { data, error } = await supabase
				.from("UserDetails")
				.update({ udMobileNumber: phoneNumber })
				.match({ uuid: userId?.id });
			if (error) {
				console.error(error);
			}
		}
		if (address) {
			const { data, error } = await supabase
				.from("UserDetails")
				.update({ udAddress: address })
				.match({ uuid: userId?.id });
			if (error) {
				console.error(error);
			}
		}
		if (zipCode) {
			const { data, error } = await supabase
				.from("UserDetails")
				.update({ udZipCode: zipCode })
				.match({ uuid: userId?.id });
			if (error) {
				console.error(error);
			}
		}
		if (value) {
			const { data, error } = await supabase
				.from("UserDetails")
				.update({ udCountry: value })
				.match({ uuid: userId?.id });
			if (error) {
				console.error(error);
			}
		}
		window.location.reload();

		// await supabase.from('User Details').update('')
	};
</script>

<title>My Account - {$companyName}</title>
<div
	class="flex min-h-screen flex-col justify-center bg-mainbg font-inter md:flex-row"
>
	<form
		on:submit|preventDefault={updateUserInfo}
		class="flex flex-col px-2 pb-10 pt-10 lg:w-8/12 lg:px-4"
	>
		<div
			class="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between"
		>
			<div class="flex items-center space-x-8">
				<div
					class="flex h-20 w-20 items-center justify-center rounded-full border border-borderColor bg-secondarybg lg:h-40 lg:w-40"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-1/3 w-1/3 stroke-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						/>
					</svg>
				</div>
				<div class="text-white ">
					<p class="text-2xl text-main">{$userName} {$userSurname}</p>
					<p class="mt-1 text-sm ">
						{$companyName} User since {userCreationDate}
					</p>
				</div>
			</div>
			<div class="mt-8 text-center lg:space-y-4 space-y-2">
				<a href="/" rel="_external" class="buttonBig hidden px-8 lg:block"
					>Return to homepage</a
				>
				<a href={$nav.bot} class=" buttonBigGain block">Invest Now</a>
				<a href={$nav.reset} class="buttonBig block lg:hidden">Change Password</a>
			</div>
		</div>
		<div class="w-full text-sm">
			<div class="mt-16 flex h-full w-full flex-col space-y-4 text-white ">
				<div
					class="flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0"
				>
					<div class="w-full">
						<p class="mb-2">First {$t("name")}</p>
						<input
							type="text"
							class="inputInitial"
							bind:value={firstName}
							placeholder={$userName}
						/>
					</div>
					<div class="w-full">
						<p class="mb-2">Last Name</p>
						<input
							type="text"
							class="inputInitial"
							bind:value={lastName}
							placeholder={$userSurname}
						/>
					</div>
				</div>
				<div
					class="flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0"
				>
					<div class="w-full">
						<p class="mb-2">
							{$t("emailAddress")}
							<span class="opacity-70"> - Not changeable</span>
						</p>
						<input
							bind:value={emailAddress}
							type="text"
							disabled
							class="inputInitial"
							placeholder={$userEmail}
						/>
					</div>
					<div class="w-full">
						<p class="mb-2">Phone Number</p>
						<input
							type="text"
							class="inputInitial"
							bind:value={phoneNumber}
							placeholder={$userPhoneNumber}
						/>
					</div>
				</div>
				<div class="countriesThemed w-full select-none">
					<p class="mb-2">{$t("country")}</p>
					<Select
						items={countryList}
						{value}
						on:select={handleSelect}
						placeholder={$userCountry}
					/>
				</div>
				<div
					class="flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0"
				>
					<div class="w-full">
						<p class="mb-2">{$t("address")}</p>
						<input
							type="text"
							bind:value={address}
							class="inputInitial"
							placeholder={$userAddress}
						/>
					</div>
					<div class="w-full">
						<p class="mb-2">{$t("city")}</p>
						<input
							type="text"
							class="inputInitial"
							placeholder={$userCity}
							bind:value={city}
						/>
					</div>
					<div class="w-full">
						<p class="mb-2">{$t("zipCode")}</p>
						<input
							type="text"
							class="inputInitial"
							bind:value={zipCode}
							placeholder={$userZipCode}
						/>
					</div>
				</div>
			</div>
		</div>
		<div class=" mt-12 flex flex-col space-y-4">
			<div class="flex space-x-4">
				<button
					class="buttonBigSecondary block whitespace-nowrap"
					on:click={resetFields}>Reset</button
				>
				<button class="buttonBig block whitespace-nowrap"
					>Update Information</button
				>
			</div>
			<div class="block">
				<a
					href={$companyEmail}
					class="buttonSmall block w-full whitespace-nowrap text-center text-white opacity-70 hover:opacity-100"
					>Contact Customer Support</a
				>
			</div>
		</div>
	</form>
</div>

<style>
	.countriesThemed {
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
