<script lang="ts">
	import { onMount } from "svelte";
	import "../app.css";
	import supabase from "$lib/db";
	import { browser } from "$app/env";
	import { page, session } from "$app/stores";
	import { RingLoader } from "svelte-loading-spinners";
	import Navbar from "$lib/components/Navbar.svelte";
	import {
		invested,
		current,
		loadUserInfo,
		loadUserDetails,
	} from "$lib/stores/store";
	import { afterNavigate, goto } from "$app/navigation";
	import { nav, pageOpened } from "$lib/stores/nav";
	import exitDropdowns from "$lib/components/Navbar.svelte";
	import { user } from "$lib/stores/authStore/authStore";
	import { widgetReady } from "$lib/stores/widgetReady";
	import {
		checkBotWinnings,
		onStart,
		regulateBotWinnings,
	} from "$lib/logic/simplified";

	user.set(supabase.auth.user());
	let sessionValue: any;

	function checkWebState() {
		pageOpened.set(false);
		if ($page.url.pathname == "/" || $page.url.pathname == "") {
			pageOpened.set(true);
		} else {
			pageOpened.set(false);
		}
	}

	afterNavigate(() => {
		exitDropdowns();
	});

	let userId: any;

	supabase.auth.onAuthStateChange((event, sesh) => {
		userId = sesh;
	});
	$: userId = supabase.auth.session();
	$: if (browser && userId == null) {
		goto($nav.login);
	} else {
		setTimeout(() => {
			widgetReady.set(true);
		}, 1000);
	}

	const associateUUID = async () => {
		const userId = supabase.auth.user();
		if (await userId) {
			const { data, error } = await supabase
				.from("Users")
				.update({ uuid: userId?.id })
				.eq("uEmail", userId?.email);

			if (error) {
				console.error(error);
			}
		}
	};

	const udAssociateUUID = async () => {
		const userId = supabase.auth.user();
		if (await userId) {
			const { data, error } = await supabase
				.from("UserDetails")
				.update({ uuid: userId?.id })
				.eq("udEmail", userId?.email);

			if (error) {
				console.error(error);
			}
		}
	};

	const reloadIfNoUUID = async () => {
		const { data, error } = await supabase
			.from("Users")
			.select("uuid")
			.eq("uEmail", userId?.email)
			.single();

		if (data.uuid == null || data.uuid == "") {
			if (browser) {
				window.location.reload();
			}
		}
	};

	let addingBotWinnings: any = null;

	onMount(async () => {
		const userId = supabase.auth.user();

		associateUUID();
		udAssociateUUID();
		loadUserInfo(userId?.id);
		loadUserDetails(userId?.id);

		let daysToAdd: any = 0;
		daysToAdd = await checkBotWinnings(userId?.id);
		
		if (daysToAdd > 0) {
			popupAddingBotWinnings = true;
			addingBotWinnings = true;
			addingBotWinnings = await regulateBotWinnings(userId?.id, daysToAdd);
			if (addingBotWinnings == false) {
				setTimeout(() => {
					loadUserInfo(userId?.id);
					loadUserDetails(userId?.id);
					popupAddingBotWinnings = false;
					onStart();
				}, 3000);
			}
		}
		else {
			onStart();
		}
	});

	$: if ((addingBotWinnings = false)) {
	}

	let popupAddingBotWinnings = false;

	setInterval(() => onStart(), 55000);
</script>

{#if popupAddingBotWinnings}
	<div
		class="fixed top-1/2 left-1/2 z-[550] flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-mainbg bg-opacity-90 font-inter text-white"
	>
		<div
			class="flex max-w-sm flex-col items-center border border-borderColor bg-mainbg p-6 text-center opacity-100"
		>
			<RingLoader size="60" color="#26A67F" unit="px" duration="1s" />
			<p class="mt-10 font-semibold text-main">Updating</p>
			<p class="mt-3 text-xs">
				Please wait while your account is updated.<br />
				This is not going to take long. Thank you for your patience!
			</p>
		</div>
	</div>
{/if}

<div class={popupAddingBotWinnings ? "" : ""}>
	<Navbar invested={$invested} current={$current} />
	<slot class="" />
</div>

<!-- {#if $locale} -->

<!-- {/if} -->
<style>
</style>
