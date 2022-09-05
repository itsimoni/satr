<script>
	import Icon from "$lib/Icon.svelte";

	import { companyName } from "$lib/stores/store";
</script>

<footer
	class="footer bg-neutral text-neutral-content flex w-full items-center justify-between py-4 pl-4 pr-2 font-inter text-xs text-white "
>
	<div class="flex  items-center opacity-80 hover:opacity-100">
		<Icon classNames="mr-1 h-4" />
		<!-- class="mr-1 h-4" /> -->
		<p class="ml-2" />
	</div>
	<div class="flex items-center opacity-80 hover:opacity-100">
		<p>All rights reserved - {$companyName} 2022©</p>
	</div>
	<!-- svelte-ignore a11y-invalid-attribute -->
</footer>
