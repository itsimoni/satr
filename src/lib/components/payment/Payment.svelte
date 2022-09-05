<script context="module">
	export let amountUsd = 1;

	export const load = async ({ fetch }) => {
		try {
			const response = await fetch("https://www.poof.io/api/v1/checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: "CryptoNetic",
					amount: amountUsd,
					fields: ["Email", "Name"],
					redirect: "http://localhost:3000",
				})
			});
			const data = await response.text();
			location.href(awaitdata)

			// return {
			// 	props: { ...(await response.text()) },
			// };
		} catch (error) {
			console.error(error);
		}
	};
</script>

<script lang="ts">
	import { goto } from "$app/navigation";

	import { onMount } from "svelte";

	let link: any = "";
	onMount(async () => {
		link = await load();
	});
</script>

<div>
	<button
		on:click={() => goto(link)}
		class="buttonBig overflow-hidden px-8"
		id="poof"
		>Continue
	</button>
</div>

<svelte:head>
	<script src="https://www.poof.io/static/api/checkout_v2.js"></script>
	<script src="https://www.poof.io/static/api/sdk.js"></script>
</svelte:head>
