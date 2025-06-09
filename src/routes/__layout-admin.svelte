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

	$: if(browser) {
		// Check if the current page is NOT the confirmation page
		if (window.location.pathname !== '/routes/confirm@external') {
			if (userId == null) {
				goto(adminNav.login);
			} else {
				goto(adminNav.users);
			}
		}
	}
</script>

<slot />
