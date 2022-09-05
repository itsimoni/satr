<script lang="ts">
	import { browser } from "$app/env";

	import { goto } from "$app/navigation";
	import { page } from "$app/stores";

	import supabase from "$lib/db";
	import { nav } from "$lib/stores/nav";

	import "../app.css";

	let userId: any;

	supabase.auth.onAuthStateChange((event, sesh) => {
		userId = sesh;
	});

	$: userId = supabase.auth.session();
	const urlAddress = $page.url.pathname;
	if (urlAddress.startsWith("/login/")) {
		console.log($page.url.pathname);
		supabase.auth.signOut();
	}
	$: if (browser && userId !== null) {
		goto($nav.trade);
	}
</script>

<slot />
