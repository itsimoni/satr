<script lang="ts">
	import { onMount } from "svelte";
	import "../app.css";
	import supabase from "$lib/db";
	import { browser } from "$app/env";
	import { page, session } from "$app/stores";
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
	import { adminNav } from "$lib/admin/store/adminNav";
	import { onStart } from "$lib/logic/simplified";

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

	onMount(async () => {
		const userId = supabase.auth.user();

		// setTimeout(async () => {
		// 	const { data, error } = await supabase
		// 		.from("Users")
		// 		.select("uEmail, uFname")
		// 		.eq("uEmail", userId?.email)
		// 		.single();

		// 	if (error) {
		// 		supabase.auth.signOut();
		// 	}
		// }, 3000);

		associateUUID();
		udAssociateUUID();
		loadUserInfo(userId?.id);
		loadUserDetails(userId?.id);
	});

	onStart();
	setInterval(() => onStart(), 55000);
	// if (browser) {
	// 	window.$crisp = [];
	// 	window.CRISP_WEBSITE_ID = "bccaed33-9835-4f10-96b6-8afd1f3f42ff";
	// 	(function () {
	// 		let d = document;
	// 		let s = d.createElement("script");
	// 		s.src = "https://client.crisp.chat/l.js";
	// 		s.async = true;
	// 		d.getElementsByTagName("head")[0].appendChild(s);
	// 	})();
	// }
</script>

<div class="">
	<Navbar invested={$invested} current={$current} />
	<slot class="" />
</div>

<!-- {#if $locale} -->

<!-- {/if} -->
<style>
</style>
