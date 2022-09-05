<script lang="ts">
	export let title: string;
	export let subtext: string;
	export let selected: boolean = false;

	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	function sayHello() {
		dispatch("message", {
			text: title,
		});
	}
</script>

<div
	class="group flex w-full cursor-pointer items-center  border border-borderColor font-inter hover:bg-opacity-50 "
	on:click={sayHello}
>
	<div
		class="flex aspect-square h-full items-center justify-center  px-8 py-8 {selected
			? 'bg-gain group-active:bg-gainActive '
			: 'bg-secondarybg bg-opacity-50  group-hover:bg-opacity-100'}"
	>
		{#if title == "Cryptocurrencies"}
			<svg xmlns="http://www.w3.org/2000/svg" class="w-8" viewBox="0 0 392 392">
				<path
					id="Union_2"
					data-name="Union 2"
					d="M156.5,388.019a194.939,194.939,0,0,1-70.085-29.492A196.57,196.57,0,0,1,15.4,272.292,195.074,195.074,0,0,1,3.982,235.5a197.933,197.933,0,0,1,0-79A194.94,194.94,0,0,1,33.474,86.414,196.57,196.57,0,0,1,119.708,15.4,195.034,195.034,0,0,1,156.5,3.982a197.933,197.933,0,0,1,79,0,194.94,194.94,0,0,1,70.085,29.492A196.571,196.571,0,0,1,376.6,119.708,195.031,195.031,0,0,1,388.019,156.5a197.933,197.933,0,0,1,0,79,194.94,194.94,0,0,1-29.492,70.085A196.571,196.571,0,0,1,272.292,376.6,195.072,195.072,0,0,1,235.5,388.019a197.933,197.933,0,0,1-79,0ZM34,196c0,89.327,72.673,162,162,162s162-72.673,162-162S285.327,34,196,34,34,106.673,34,196ZM175.742,307.863V286.41c-41.378-9.192-68.958-43.927-68.958-89.387s27.585-79.681,68.958-89.387v-23.5h39.841V106.1c26.562,4.087,43.927,17.369,53.633,30.649l-30.135,28.094c-8.684-12.257-21.453-18.9-37.287-18.9-28.094,0-47.5,19.921-48.011,50.566,0,30.136,19.408,51.079,47.5,51.079,16.343,0,29.112-7.151,37.286-18.9l30.645,28.6c-9.706,13.793-27.071,27.071-53.633,30.649v19.921Z"
					fill="#fff"
				/>
			</svg>

			<!-- <svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-8 w-8 fill-white"
				viewBox="0 0 338.238 459.999"
			>
				<g
					id="Group_9"
					data-name="Group 9"
					transform="translate(-86.882 -26.001)"
				>
					<path
						id="Path_11"
						data-name="Path 11"
						d="M362.2,244c24.913-12.74,40.767-35.39,37.088-73.044-4.814-51.526-47.131-68.8-103.188-73.607V26H252.5V95.363c-11.325,0-22.932.283-34.539.564V26h-43.6V97.345c-16.029.484-34.7.248-87.479,0v46.43c34.423-.609,52.483-2.821,56.623,19.251V358.37c-2.629,17.515-16.643,14.991-47.846,14.438l-8.775,51.809c79.495,0,87.479.284,87.479.284V486h43.6V425.75c11.888.285,23.5.285,34.539.285V486h43.6V424.9c73.043-3.964,121.871-22.366,128.384-91.16C429.579,278.535,403.531,253.9,362.2,244ZM218.811,146.889c24.631,0,101.639-7.643,101.639,43.6,0,48.979-77.007,43.315-101.639,43.315Zm0,226.2V277.4c29.445,0,119.608-8.209,119.608,47.847,0,54.072-90.164,47.844-119.608,47.844Z"
					/>
				</g>
			</svg> -->
		{/if}
		{#if title == "Bank Transfer"}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				/>
			</svg>
		{/if}
		{#if title == "Credit Card"}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
				/>
			</svg>{/if}
	</div>
	<div class="ml-6 ">
		<!-- {#if title == "Cryptocurrencies"}
			<div
				class="flex items-center w-fit justify-center whitespace-nowrap rounded-full  bg-secondarybg px-3 py-0.5 "
			>
				<p class="text-xs ">Reccommended</p>
			</div>
			<h3 class="text-lg font-semibold">{title}</h3>
		{/if} -->
		{#if title == "Cryptocurrencies"}
			<div class="flex items-center space-x-2 md:space-x-4">
				<h3 class="text-base md:text-lg font-semibold">{title}</h3>
				<div
					class="flex items-center justify-center whitespace-nowrap rounded-full bg-gain hover:bg-gainHover text-main px-3 py-0.5 "
				>
					<p class="text-xs lg:hidden">Popular</p>
					<p class="text-xs hidden lg:block">Reccommended</p>
				</div>
			</div>
		{/if}
		{#if title !== "Cryptocurrencies"}
			<h3 class="text-base md:text-lg font-semibold">{title}</h3>
		{/if}
		<p class="mt-1 text-xs md:text-sm">{subtext}</p>
	</div>
</div>
