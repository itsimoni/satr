<script lang="ts">
	import { nav } from "$lib/stores/nav";
	import { companyName, companyHomepage, companyEmail } from "$lib/stores/store";
	import Logo from "$lib/fulllogo.svg";



</script>

<title>Login - {$companyName}</title>

<div class="absolute top-6 left-0 z-30 mx-4 flex font-inter">
	<div class="rounded-lg py-3 text-sm">
		<a
			href={companyHomepage}
			class="w-full font-semibold text-main"
			rel="external"
			><img src={Logo} alt="Logo" class="h-8" />
		</a>
	</div>
</div>
<a
	href={companyHomepage}
	class="absolute top-6 right-0 z-30 mx-4 flex font-inter"
>
	<div
		class="buttonBigSecondary flex items-center space-x-3 rounded-lg px-4 text-xs lg:px-6 lg:text-sm"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M10 19l-7-7m0 0l7-7m-7 7h18"
			/>
		</svg>
		<p class="text-white">Return Home</p>
	</div>
</a>


<div
	class="flex h-full grow flex-col justify-between bg-mainbg font-inter md:flex-row"
>
	<div
		class="flex mt-10 h-[95vh] w-full flex-col justify-between px-4 pt-10 md:w-1/2"
	>
		<div class="text-white">
			<h2 class="textHeadingNumbers">Thank You!</h2>
			<div class="mt-12 text-white">
				<p>
					You have received a confirmation e-mail in your inbox. <br> Please confirm your E-mail. <a
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
