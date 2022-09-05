<script lang="ts">
	import { nav } from "$lib/stores/nav";
	import supabase from "$lib/db";
	import { goto } from "$app/navigation";
	import { companyName, companyHomepage } from "$lib/stores/store";
	import Logo from "$lib/Logo.svelte";

	let visibility: boolean = false;

	let type = "password";
	const toggleVisibility = () => {
		if (type == "password") {
			visibility = false;
			type = "text";
		} else {
			visibility = true;
			type = "password";
		}
	};

	let email: string, password: string;
	let error: boolean = false;

	const signIn = async () => {
		const {
			user,
			session: supabaseSession,
			error,
		} = await supabase.auth.signIn({
			email,
			password,
		});
		if (error) {
			updateError();
			return;
		} else {
			goto($nav.trade);
		}
	};

	const updateError = () => {
		error = !error;
	};
</script>

<title>Login - {$companyName}</title>

<div class="absolute top-6 left-0 z-30 mx-4 flex font-inter">
	<div class="rounded-lg py-3 text-sm">
		<a
			href={companyHomepage}
			class="w-full font-semibold text-main"
			rel="external"
			><Logo classNames="h-4" />
		</a>
	</div>
</div>
<a
	href={companyHomepage}
	class="absolute top-6 right-0 z-30 mx-4 flex font-inter"
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
	class="relative flex h-screen w-full flex-col items-center justify-center font-inter"
>
	<div
		class="mx-auto flex w-11/12 justify-center rounded-lg border border-borderColor bg-mainbg p-6 px-8 pt-10 pb-8 shadow-lg lg:w-4/12"
	>
		<div class="w-full bg-mainbg">
			<div class="mb-4 xl:mb-5 2xl:mb-6">
				<h1 class="textHeading">Sign in to your account</h1>
				<p class="mt-4 text-sm text-white">
					or <a
						href="{companyHomepage}/about.html"
						class="underline underline-offset-1"
						>learn more about {$companyName}.</a
					>
				</p>
			</div>

			<form
				on:submit|preventDefault={signIn}
				class="mt-8 transform-gpu space-y-4 xl:mt-9 2xl:mt-10"
				autocomplete="off"

			>
				{#if error}
					<div
						class=" mb-4 flex w-full items-center justify-between rounded-lg border border-red-500 p-2.5 text-sm xl:mb-5 2xl:mb-6"
					>
						<p class="inline-block  text-red-500">
							<span class="font-semibold">Incorrect email or password.</span>
							<a
								href="mailto:support@bbepank.com"
								class="underline underline-offset-1">Contact support</a
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
				<div class="relative">
					<input
						type="text"
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
				<div class="relative ">
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
							class="border-1 peer block w-full appearance-none rounded-lg border-borderColor bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-white focus:border-blue-600 focus:outline-none focus:ring-0"
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
				<div class="flex flex-col space-y-2 lg:flex-row lg:justify-between">
					<div class="flex items-center">
						<input
							type="checkbox"
							name=""
							class="checkbox rounded bg-mainbg"
							id="remember"
						/>
						<label for="remember" class="ml-2 text-sm text-gray-400"
							>Remember me</label
						>
					</div>
					<!-- <div>
						<a
							class="text-sm text-blue-500 hover:text-blue-400 active:text-blue-600"
							href={$nav.recovery}>Forgot your password?</a
						>
					</div> -->
				</div>
				<div class="pt-2">
					<button
						type="submit"
						class="mt-4 mb-4 block w-full appearance-none rounded-lg bg-blue-600 px-2.5 py-3.5 text-sm text-white hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-700"
						>Log In</button
					>
				</div>
			</form>
			<button
				on:click={() => goto($nav.registration)}
				class="buttonBigSecondary rounded-lg py-3.5 text-center text-sm"
				>Create new Account</button
			>
		</div>
	</div>

	<div class="absolute -z-10 h-full w-full overflow-hidden blur-sm">
		<img
			src="login/plat.png"
			alt=""
			class="selectNone h-full w-full select-none object-cover"
		/>
	</div>
</div>
