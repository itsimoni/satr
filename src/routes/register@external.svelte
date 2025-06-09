<script lang="ts">
	import { nav } from "$lib/stores/nav";
	import {
		companyEmail,
		companyName,
		companyHomepage,
	} from "$lib/stores/store";
	import supabase from "$lib/db";
	let country: string = "";
	import Select from "svelte-select";
	import { countryList } from "$lib/stores/countryDataset";
	import { goto } from "$app/navigation";
	import Logo from "$lib/fulllogo.svg";

	let visibility: boolean = false;
	let type = "password";
	const toggleVisibility = () => {
		type = type === "password" ? "text" : "password";
		visibility = type === "password" ? false : true;
	};

	async function uploadDB() {
		const { data, error } = await supabase.from("Users").insert([
			{
				uEmail: email,
				uFname: firstName,
				uLname: lastName,
				uPassword: password,
				uSignUpReferalCode: SignUpReferalCode,
				uBrand: "EliteBot", // Automatically set the uBrand value
			},
		]);
		if (error) {
			errorMessage = "An error occurred while saving user information. Please try again.";
			errorModal = true;
			return; // To stop execution if there's an error
		}
	}

	async function uploadUserDetails() {
		const { data, error } = await supabase.from("UserDetails").insert([
			{
				udEmail: email,
				udCountry: country,
				udMobileNumber: phoneNumber,
			},
		]);
		if (error) {
			console.error(error);
			throw error;
		}
	}

	async function signUp() {
		if (country === "") {
			errorMessage = "Please select a country.";
			errorModal = true;
			return;
		}

		const {
			user: us,
			session: supabaseSession,
			error,
		} = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			alert(error.message);
			return;
		}

		try {
			// Insert user into the Users table with uBrand as 'EliteBot'
			await uploadDB();

			// Insert user details into the UserDetails table
			await uploadUserDetails();

			// Redirect the user to a confirmation page
			goto('/confirm');
		} catch (error) {
			alert("An error occurred while updating the database. Please try again.");
		}
	}

	const updateError = async () => {
		errorModal = !errorModal;
	};

	function handleSelect(event) {
		country = event.detail.value;
	}

	let email: string, password: string;
	let firstName: string;
	let lastName: string;
	let phoneNumber: string;
	let SignUpReferalCode: string;
	let errorModal: boolean = false;
	let errorMessage: string;
</script>


<div class="absolute top-6 left-0 z-30 mx-4 flex font-inter">
	<div class="rounded-lg py-3 text-sm">
		<a
			href={companyHomepage}
			class="w-full font-semibold text-main"
			rel="external"
			><img src={Logo} alt="Logo" class="h-6" />
		</a>
	</div>
</div>
<a
	class="absolute top-6 right-0 z-30 mx-4 flex font-inter"
	href={companyHomepage}
>
	<div
		class="buttonBigSecondary flex items-center space-x-3 rounded-lg px-4 text-xs lg:px-6 lg:text-sm"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M10 19l-7-7m0 0l7-7m-7 7h18"
			/>
		</svg>
		<p class="text-white">Return Home</p>
	</div>
</a>

<div
	class="relative flex h-screen w-full flex-col  items-center justify-center font-inter"
>
	<div
		class="mx-auto mt-8 flex w-full justify-center rounded-lg border-t border-borderColor bg-mainbg p-6 px-8 pt-10 lg:w-7/12 lg:border lg:pb-8 lg:shadow-lg"
	>
		<div class="w-full bg-mainbg">
			<div class="mb-4 xl:mb-5 2xl:mb-6">
				<h1 class="textHeading ">Create a {$companyName} account</h1>
				<p class="mt-4 text-sm text-white">
					or <a
						href="{companyHomepage}/about.html"
						class="underline underline-offset-1"
						>learn more about {$companyName}.</a
					>
				</p>
			</div>

			<form
				on:submit|preventDefault={signUp}
				autocomplete="one-time-code"
				class="mt-8 transform-gpu space-y-4 xl:mt-9 2xl:mt-10"
			>
				{#if errorModal}
					<div
						class=" mb-4 flex w-full items-center justify-between rounded-lg border border-red-500 p-2.5 text-sm xl:mb-5 2xl:mb-6"
					>
						<p class="inline-block  text-red-500">
							<span class="font-semibold">{errorMessage}</span>
							<a href={$companyEmail} class="underline underline-offset-1"
								>Contact support</a
							> for more information.
						</p>
						<svg
							on:click={updateError}
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 stroke-red-500"
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
				<div
					class="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0"
				>
					<div class="w-full">
						<div class="flex items-center space-x-4">
							<div class="relative w-full lg:w-1/2">
								<input
									type="text"
									bind:value={firstName}
									id="floating_outlined"
									class="border-1 peer block w-full appearance-none rounded-lg border-borderColor bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-white focus:border-blue-600 focus:outline-none focus:ring-0 "
									placeholder=" "
								/>
								<label
									for="floating_outlined"
									class="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-mainbg px-2 text-sm text-gray-400 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 "
									>First Name</label
								>
							</div>
							<div class="relative w-full lg:w-1/2">
								<input
									type="text"
									bind:value={lastName}
									id="floating_outlined"
									class="border-1 peer block w-full appearance-none rounded-lg border-borderColor bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-white focus:border-blue-600 focus:outline-none focus:ring-0 "
									placeholder=" "
								/>
								<label
									for="floating_outlined"
									class="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-mainbg px-2 text-sm text-gray-400 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 "
									>Last Name</label
								>
							</div>
						</div>
					</div>
					<div class="relative w-full">
						<input
							type="email"
							bind:value={email}
							id="floating_outlined"
							class="border-1 peer block w-full appearance-none rounded-lg border-borderColor bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-white focus:border-blue-600 focus:outline-none focus:ring-0 "
							placeholder=" "
						/>
						<label
							for="floating_outlined"
							class="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-mainbg px-2 text-sm text-gray-400 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 "
							>Email Address</label
						>
					</div>
				</div>
				<div
					class="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4"
				>
					<div class="relative w-full">
						<input
							type="tel"
							bind:value={phoneNumber}
							id="floating_outlined"
							class="border-1 peer block h-full w-full appearance-none rounded-lg border-borderColor bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-white focus:border-blue-600 focus:outline-none focus:ring-0 "
							placeholder=" "
						/>
						<label
							for="floating_outlined"
							class="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-mainbg px-2 text-sm text-gray-400 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 "
							>Phone Number <span class="hidden text-xs lg:inline-block"
								>(International Format)</span
							></label
						>
					</div>
					<div class="relative w-full">
						<div class="countriesThemed w-full text-sm text-white">
							<Select
								items={countryList}
								value={country}
								on:select={handleSelect}
								placeholder={"Country"}
								id="Country"
							/>
						</div>
					</div>
				</div>
				
				<div
					class="flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2"
				>
				<div class="relative w-full">
						<input
							type="text"
							bind:value={SignUpReferalCode}
							id="floating_outlined"
							class="border-1 peer block w-full appearance-none rounded-lg border-borderColor bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-white focus:border-blue-600 focus:outline-none focus:ring-0 "
							placeholder=" "
						/>
						<label
							for="floating_outlined"
							class="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-mainbg px-2 text-sm text-gray-400 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 "
							>Referal Code</label
						>
					</div>
					<div class="relative w-full">
					{#if type === "password"}
						<input
							bind:value={password}
							type="password"
							id="floating_outlined"
							class="border-1 peer block w-full appearance-none rounded-lg border-borderColor bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-white focus:border-blue-600 focus:outline-none focus:ring-0"
							placeholder=" "
						/>
					{:else if type === "text"}
						<input
							bind:value={password}
							type="text"
							id="floating_outlined"
							class="border-1 peer block  w-full appearance-none rounded-lg border-borderColor bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-white focus:border-blue-600 focus:outline-none focus:ring-0"
							placeholder=" "
						/>
					{/if}
					<label
						for="floating_outlined"
						class="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-mainbg px-2 text-sm text-gray-400 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600"
						>Password</label
					>
					<svg
						on:click={toggleVisibility}
						xmlns="http://www.w3.org/2000/svg"
						class="absolute top-3.5 right-4 h-5 w-5 stroke-white {visibility
							? 'hidden'
							: 'block'} transition delay-75"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
						/>
					</svg>
					<svg
						on:click={toggleVisibility}
						xmlns="http://www.w3.org/2000/svg"
						class="absolute right-4  top-3.5 h-5 w-5 stroke-white {visibility
							? 'block'
							: 'hidden'} transition delay-75"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
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
				
				<div class="flex  flex-col">
					<button
						type="submit"
						class="mt-4 mb-4 block w-full appearance-none rounded-lg bg-blue-600 px-2.5 py-3.5 text-sm text-white hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-700"
						>Create Account</button
					>
					<a
						href={$nav.login}
						rel="_external"
						class="buttonBigSecondary w-full grow rounded-lg py-3.5 text-center text-sm"
						>Login to your existing account</a
					>
				</div>
			</form>
		</div>
	</div>
	<!-- * END MAIN SECTION  -->

	<div class="absolute -z-10 h-full w-full overflow-hidden blur-sm">
		<img
			src="login/plat.png"
			alt=""
			class="selectNone h-full w-full select-none object-cover"
		/>
	</div>
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
		--placeholderColor: #9aa5ad;
		--placeholderOpacity: 100%;
		--listBorderRadius: 0.5rem;
		--listBorder: 1px solid #363c4e;
		--itemFirstBorderRadius: 0px;
		--inputColor: white;
		--borderFocusColor: #363c4e;
		--borderActiveColor: #363c4e;
		--indicatorColor: yellow;
		--borderRadius: 0.5rem;
	}
</style>
