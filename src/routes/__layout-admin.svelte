<script lang="ts">
	import { browser } from "$app/env";

	import { goto } from "$app/navigation";
	import { adminNav } from "$lib/admin/store/adminNav";

	import supabase from "$lib/db";

	import "../app.css";
	let userId: any;
	supabase.auth.onAuthStateChange((event, sesh) => {
		userId = sesh;
	});

	$: userId = supabase.auth.session();

	$: if (browser && userId == null) {
		goto(adminNav.login);
	}
	if (browser && userId !== null) {
		goto(adminNav.users);
	}
</script>

<slot />
