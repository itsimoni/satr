<script lang="ts">
	import { t } from "$lib/services/i18n";
	import { nav } from "$lib/stores/nav";
	import { companyEmail, companyName } from "$lib/stores/store";
</script>

<div
	class="flex h-full grow flex-col justify-between bg-mainbg font-inter md:flex-row "
>
	<div
		class="flex h-[95vh] w-full flex-col justify-between px-4 pt-10 md:w-1/2"
	>
		<div class="text-white">
			<h2 class="textHeadingNumbers">{$t("thankyou")}!</h2>
			<div class="mt-12 text-white">
				<p>
					For additional information or help feel free to contact <a
						class="link underline"
						href="mailto:{$companyEmail}">our support team</a
					>
					at {$companyName}.
				</p>
			</div>
			
			<div class="my-4 mt-12 inline-flex md:absolute md:bottom-4 md:left-4 md:my-0">
				
				<a href="{$nav.trade}" class="buttonBig">Return Home</a>
			</div>

		</div>
	</div>
	<div
		class="topoBg mt-12 flex w-full flex-col items-center justify-center bg-secondarybg py-14 md:mt-0 md:w-2/5"
	/>
</div>
