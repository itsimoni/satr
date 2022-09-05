<script lang="ts">
	export let percMin: number = 1;
	export let percMax: number = 2;
	export let amount: number = 100;
	export let highlighted: string = "";
	import { t } from "$lib/services/i18n";
import { nav } from "$lib/stores/nav";

	export let offer = "";
	$: if (offer === "") {
		offer = $t("emDailyProfit");
	}
	$: if (offer === "popular") {
		offer = $t("emPopular");
	}
	$: if (offer === "best") {
		offer = $t("emBest");
	}
</script>

<div
	class="group flex w-full flex-col justify-between border-[1px]  border-borderColor lg:h-48 {highlighted ==
		'value' || highlighted == 'popular'
		? 'border-gray-500 bg-gradient-to-r from-secondarybg via-mainbg to-secondarybg p-2 hover:border-gold hover:from-mainbg hover:via-[#40390F] hover:to-mainbg'
		: '0g bg-gradient-to-r  from-mainbg  via-secondarybg to-mainbg p-2 hover:border-gain hover:via-[#0F4031]'}"
>
	<div class="justify-betweeen mb-2 flex grow flex-col  items-center">
		<div
			class="w-full border-b border-borderColor p-2 group-hover:border-gain {highlighted ==
				'value' || highlighted == 'popular'
				? ' border-gray-500 group-hover:border-gold'
				: ' '}"
		>
			<p class="text-sm uppercase text-white opacity-80">{offer}</p>
		</div>
		<div class="flex grow flex-col items-center justify-center my-5">
			<p class="textModal">{`${percMin} - ${percMax} %`}</p>
		</div>
	</div>

	<a
		href="{$nav.deposit}"
		class="flex items-center justify-center border border-borderColor bg-mainbg bg-opacity-50 p-2 hover:bg-opacity-25 active:border-gainActive group-hover:border-gain {highlighted ==
			'value' || highlighted == 'popular'
			? 'border-gray-500 active:border-gold group-hover:border-gold'
			: ''}"
	>
		{`${amount.toLocaleString()}€`}
	</a>
</div>
