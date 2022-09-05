<script lang="ts">
	import { fade } from "svelte/transition";
	import PartnersGrid from "$lib/components/arbitrage/PartnersGrid.svelte";
	import ArbitrageGrid from "$lib/components/arbitrage/ArbitrageGrid.svelte";
	import { companyName, current, invested, live } from "$lib/stores/store";
	import Modal from "$lib/components/Modal.svelte";
	import { t, locale, locales } from "$lib/services/i18n";
	import Particles from "svelte-particles";
	import { loadFull } from "tsparticles";
	import { nav } from "$lib/stores/nav";
	import { goto } from "$app/navigation";
	import {
		calculateDailyPerc,
		calculateDailyPercentage,
		getDailyArbitragePerc,
		msToTime,
		percMax,
		percMin,
		toFixedNr,
	} from "$lib/logic/arbitrageLogic";
	import { Svrollbar } from "svrollbar";
	import { onMount } from "svelte";

	let particlesConfig = {
		particles: {
			number: {
				value: 60,
			},
			color: {
				value: "#fff",
			},
			shape: {
				type: "circle",
				stroke: {
					width: 0,
					color: "#fff",
				},
				polygon: {
					nb_sides: 5,
				},
			},
			opacity: {
				value: 0.4,
				random: false,
				anim: {
					enable: false,
					speed: 1,
					opacity_min: 0.1,
					sync: false,
				},
			},
			size: {
				value: 3,
				random: true,
			},
			line_linked: {
				enable: true,
				distance: 150,
				color: "#ffffff",
				opacity: 0.4,
				width: 1,
			},
			move: {
				enable: true,
				speed: 2,
				direction: "none",
				random: false,
				straight: false,
				out_mode: "out",
				bounce: false,
				attract: {
					enable: false,
					rotateX: 600,
					rotateY: 1200,
				},
			},
		},
		fullScreen: { enable: false },
		interactivity: {
			detect_on: "canvas",
			events: {
				onhover: {
					enable: true,
					mode: "grab",
				},
			},
		},
		retina_detect: true,
	};
	let onParticlesLoaded = (event) => {
		const particlesContainer = event.detail.particles;
	};
	let particlesInit = async (engine) => {
		await loadFull(engine);
	};
	function openModal() {
		if (innerWidth > 1024) isOpenModal = true;
		else {
			goto($nav.earn);
		}
	}
	function closeModal() {
		isOpenModal = false;
	}
	let innerWidth = 0;
	let isOpenModal: boolean = false;
	let ready: boolean = false;
	let margin: number = 0;
	let profitArbitrage: any = 0;

	setTimeout(() => {
		ready = true;
	}, 100);

	let conversionRate = 0;
	async function calculateConversionRate() {
		let values = [];
		let value;
		fetch(`https://blockchain.info/tobtc?currency=EUR&value=1`)
			.then((response) => response.json())
			.then((response) => {
				conversionRate = response;
			});
	}

	onMount(() => calculateConversionRate());
	$: amountInBTC = $invested / conversionRate;

	const updateMargin = async (investedAmount: number) => {
		margin = await calculateDailyPerc(investedAmount);
		updateProfit();
	};

	function calculateNextUpdate() {
		const last12Am = new Date(new Date().setUTCHours(0, 0, 0, 0)).getTime();
		const next12Am = last12Am + 86400000;
		const currentDate = new Date().getTime();

		const timeLeft = next12Am - currentDate;
		return msToTime(timeLeft);
	}

	function updateProfit() {
		profitArbitrage = (margin / 100) * $invested;
		profitArbitrage = parseFloat(profitArbitrage);
	}

	$: $invested, updateProfit();

	$: $invested, updateMargin($invested);

	let nextUpdate = calculateNextUpdate();
	setInterval(() => (nextUpdate = calculateNextUpdate()), 1000);
	setInterval(() => updateMargin($invested), 3000);

	const updatePerc = async () => {
		userPerc = await getDailyArbitragePerc($invested)
	}

	onMount(async () => userPerc = await updatePerc())
	let userPerc: any = undefined;
	$: $invested, updatePerc()
</script>

<div class="text-center font-inter text-white">
	{#key $locale}
		<Modal
			{isOpenModal}
			on:closeModal={closeModal}
			heading={$t("emHeading")}
			subtext={$t("emSubtext")}
			offerBest={$t("emBest")}
			offerPopular={$t("emPopular")}
		/>
	{/key}
</div>

<title>Crypto Bot - {$companyName}</title>

<svelte:window bind:innerWidth />
<div class=" h-full min-h-screen w-full bg-mainbg font-inter text-white">
	<div
		class="topoBg relative flex w-full flex-col items-center py-16 text-center sm:bg-none lg:bg-mainbg"
	>
		{#if ready}
			<div
				class="h-full w-full transition-all delay-300"
				transition:fade={{ duration: 500 }}
			>
				{#if innerWidth > 1024}
					<Particles
						id="tsparticles"
						options={particlesConfig}
						on:particlesLoaded={onParticlesLoaded}
						{particlesInit}
					/>
				{/if}
			</div>
		{/if}
		<div class="z-10 mb-8">
			<Svrollbar />

			<p class="font-semibold">
				{$t("cbProfit")} <span class="mx-1 opacity-70">-</span>
				<span class="font-normal opacity-70"> {$t('approximately')}</span>
			</p>
			{#key margin}
				{#if margin === NaN || margin === undefined || margin == 0}
					<p class="textHeadingNumbers mt-2">{$t('calculating')}...</p>
				{/if}
				{#if margin !== NaN && margin !== undefined && margin !== 0}
					<p class="textHeadingNumbers mt-2">
						{profitArbitrage.toFixed(4)} BTC
					</p>
				{/if}{/key}
			<!-- svelte-ignore a11y-invalid-attribute -->
		</div>
		<div
			class="flex w-full flex-col items-center p-2 py-4 lg:z-10 lg:w-auto lg:flex-row lg:space-x-4 lg:p-4"
		>
			<div
				class="my-4 flex w-full flex-col items-center justify-center border border-borderColor bg-mainbg p-2 lg:h-52 lg:w-80 lg:p-4"
			>
				<div
					class="flex h-full w-full flex-col items-center justify-center border border-borderColor bg-mainbg py-4 lg:py-0"
				>
					<p class="text-sm">{$t("cbAccountBalance")}</p>
					<p class="mt-2 text-3xl font-medium text-main">
						{toFixedNr($invested, 4)} BTC
					</p>
				</div>
				<a href={$nav.deposit} class="buttonBigGain mt-2 ">{$t("investCTA")}</a>
			</div>

			<div
				class="-order-1 flex w-full items-center  justify-center border border-borderColor bg-gradient-to-t from-gain to-secondarybg p-2 lg:order-none lg:h-64 lg:w-96 lg:p-4 "
			>
				<div
					class="flex h-full w-full flex-col items-center justify-center bg-mainbg py-10 lg:py-0"
				>
					{#key margin}
						{#if margin === NaN || margin === undefined || margin == 0}
							<p class="text-7xl text-gain">...</p>
						{/if}
						{#if margin !== NaN && margin !== undefined && margin !== 0}
							<p class="text-7xl text-gain">{margin}%</p>
						{/if}
					{/key}
					<p class="mt-2 text-white">{$t('approximate')} {$t("cbPercentageDesc")}</p>
				</div>
			</div>

			<div
				class="flex w-full flex-col items-center justify-center border border-borderColor bg-mainbg p-2 lg:h-52 lg:w-80 lg:p-4"
			>
				<div
					class="flex h-full w-full flex-col items-center justify-center border border-borderColor  bg-mainbg py-4"
				>
					<p class="text-sm">{$t("cbDailyEstimate")}</p>
					{#await calculateDailyPercentage(amountInBTC)}
						<p class="mt-2 text-3xl font-medium text-main">{$t('loading')}</p>
					<!-- {/if} -->
					{:then data}
					<!-- {#if userPerc !== undefined} -->
						<p class="mt-2 text-3xl font-medium text-main">
							{data.percMin} % - {data.percMax} %
						</p>
					<!-- {/if} -->
					{/await}
				</div>
				<button class="{$live ? 'buttonBig' : 'buttonBigLoss'} mt-2"
					>{$live ? $t("liveMode") : $t("demoMode")}</button
				>
			</div>
		</div>
		<div class="z-10 my-4">
			<p class=" text-sm">
				{$t('marginResetUTC')}
			</p>
			<p class=" mt-1 text-sm">
				<span class="font-semibold">{$t('nextUpdate')}</span>
				{nextUpdate}
			</p>
		</div>
		<div
			on:click={openModal}
			id="EarnMore"
			class="z-10 mt-4 cursor-pointer border border-borderColor bg-secondarybg px-4 py-3"
		>
			<!-- svelte-ignore a11y-invalid-attribute -->
			<p class="">{$t("cbCTA")}</p>
		</div>
	</div>
	<div
		class="mx-2 mt-20 flex min-h-screen flex-col items-center text-center lg:mx-auto lg:w-11/12 lg:p-4"
	>
		<p>
			{$companyName}
			{$t("cbExplanation")}
			<span class="font-semibold">{$t("cbExplanationBold")}</span>
		</p>
		<!-- svelte-ignore a11y-invalid-attribute -->
		<PartnersGrid />
		<div
			class="mt-24 flex w-full justify-between border border-borderColor p-2 px-2 text-sm lg:px-4"
		>
			<p class="inline-block text-left opacity-50">{$companyName} ©2022</p>
			<p class="inline-block text-right">
				{$t('financialDataDisclaimer')}
			</p>
		</div>
		<ArbitrageGrid />
		<div class="my-8">
			<!-- svelte-ignore a11y-invalid-attribute -->
			<a on:click={openModal} href="#" class="buttonBig scroll-smooth px-8"
				>{$t("cbExploreTiers")}</a
			>
		</div>
	</div>
</div>

<style>
	:global(#tsparticles) {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: #131722;
	}
</style>
