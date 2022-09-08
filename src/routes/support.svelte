<script lang="ts">
	import { browser } from "$app/env";
	import supabase from "$lib/db";
	import { userPhoneNumber } from "$lib/stores/store";
	console.log(supabase.auth.user()?.email);

	if (browser) {
		window.$crisp = [];
		window.CRISP_WEBSITE_ID = "bccaed33-9835-4f10-96b6-8afd1f3f42ff";
		(function () {
			let d = document;
			let s = d.createElement("script");
			s.src = "https://client.crisp.chat/l.js";
			s.async = true;
			d.getElementsByTagName("head")[0].appendChild(s);
		})();
		window?.$crisp.push(["set", "message:text", ["Hi! I'd like to get help."]]);
		window.$crisp.push(["set", "user:email", [supabase.auth.user()?.email]]);
		window.$crisp.push(["set", "user:phone", [$userPhoneNumber]]);
	}
</script>
