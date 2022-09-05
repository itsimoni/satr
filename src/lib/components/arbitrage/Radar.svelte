<script lang="ts">
	import { onMount } from "svelte";

	function randomLocation(min: number, max: number) {
		min = Math.ceil(min);
		max = Math.floor(max);
		let result = Math.floor(Math.random() * (max - min + 1)) + min;
		return `${result}%`;
	}
	let location1: string,
		location2: string,
		location3: string,
		location4: string;

	onMount(() => {
		location1 = randomLocation(29, 71);
		location2 = randomLocation(30, 68);
		location3 = randomLocation(34, 71);
		location4 = randomLocation(32, 62);
	});
</script>

<ul
	class="radar absolute right-0 top-1/2 flex -translate-y-1/2 items-center justify-center"
	style="--left-first: {location1}; --top-first: {location2}; --top-second: {location3}; --left-second: {location4}"
>
	<div
		class="flex h-[8.5rem] w-[8.5rem] items-center justify-center rounded-full border border-gray-600"
	>
		<div
			class="flex h-[5rem] w-[5rem] items-center justify-center rounded-full border border-gray-600"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="w-2"
				viewBox="0 0 1730.467 2347.034"
			>
				<path
					id="Path_3"
					data-name="Path 3"
					d="M977.21,108.141l432.724,1173.517,432.509,1173.517H111.976L544.485,1281.658Z"
					transform="translate(-111.977 -108.141)"
					fill="#fff"
				/>
			</svg>
		</div>
	</div>
	<div class="pointer" />
	<div class="shadow" />
</ul>

<style>
	.radar {
		width: 15rem;
		height: 15rem;
	}

	.radar::before {
		content: "";
		position: absolute;
		top: var(--top-first);
		left: var(--left-first);
		width: 0.5rem;
		height: 0.5rem;
		background: #249c77;
		border-radius: 50%;
		filter: blur(2px);
		animation: glow 1s linear infinite;
	}

	.radar::after {
		content: "";
		position: absolute;
		top: var(--top-second);
		left: var(--left-second);
		width: 0.5rem;
		height: 0.5rem;
		background: rgba(5, 162, 185, 0.8);
		border-radius: 50%;
		filter: blur(2px);
		animation: glow 1s linear infinite;
	}

	.radar .pointer {
		position: absolute;
		z-index: 1024;
		left: 10.5820106%;
		right: 10.5820106%;
		top: 10.5820106%;
		bottom: 50%;
		will-change: transform;
		transform-origin: 50% 100%;
		border-radius: 50% 50% 0 0 / 100% 100% 0 0;
		background-image: linear-gradient(
			135deg,
			rgba(5, 162, 185, 0.8) 0%,
			rgba(0, 0, 0, 0.02) 70%,
			rgba(0, 0, 0, 0) 100%
		);
		clip-path: polygon(100% 0, 100% 10%, 50% 100%, 0 100%, 0 0);

		animation: rotate360 5s infinite linear;
	}

	.radar li:nth-child(1),
	.radar li:nth-child(2) {
		list-style: none;
		position: absolute;
		top: 50%;
		height: 1px;
		z-index: -20;
		width: calc(100% - 53px);
		background: rgb(75 85 99);
	}

	.radar li:nth-child(2) {
		transform: rotate(90deg);
	}

	.radar .pointer:after {
		content: "";
		position: absolute;
		width: 50%;
		bottom: -1px;
		box-shadow: 0 0 3px rgba(0, 231, 244, 0.6);
		border-radius: 9px;
	}

	.shadow {
		position: absolute;
		left: 11%;
		top: 11%;
		right: 11%;
		bottom: 11%;
		margin: auto;
		border-radius: 9999px;
		box-shadow: 0 0 24px 1px #249c77;
		animation: shadow 1s infinite ease;
	}

	@keyframes rotate360 {
		0% {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(-360deg);
		}
	}

	@keyframes shadow {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	@keyframes glow {
		0% {
			opacity: 0%;
		}
		50% {
			opacity: 100%;
		}
		100% {
			opacity: 0%;
		}
	}
</style>
