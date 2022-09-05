<script context="module">
	export function load({ error, status }) {
		return {
			props: {
				title: `${status}`,
				errorMessage: error.message,
			},
		};
	}
</script>

<script lang="ts">
	export let title: any = "";
	export let errorMessage: any = "";
</script>

<div
	class="flex h-full flex-col items-center justify-center bg-mainbg font-inter"
	style="min-height: calc(100vh - 6vh);"
>
	<h1 class="mb-2 text-9xl font-semibold text-main">{title}</h1>
	<p class="text-md text-mdgray mb-8 font-semibold text-white">
		{errorMessage}
	</p>
	<a href="/" class="buttonBig w-36 text-center">Return Home</a>
</div>
