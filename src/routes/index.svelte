<script lang="ts">
  import { onMount } from 'svelte';
  import supabase from '$lib/db';
  import { userUuid, invested } from '$lib/stores/store'; // Ensure these stores are correctly set up
  import Footer from '$lib/components/Footer.svelte';
  import { t } from "$lib/services/i18n";
  import { companyName } from '$lib/stores/store';
  import PairsLeft from "$lib/components/PairsLeft.svelte";
  import PairsRight from "$lib/components/PairsRight.svelte";
  import EmbededTradingViewWidget from "$lib/components/EmbededTradingViewWidget.svelte";
  import { widgetReady } from "$lib/stores/widgetReady";
  import Logo from "$lib/Logo.svelte";
  import { nav } from '$lib/stores/nav';

  let widgetFullscreen = false;

  function openFullscreen() {
    widgetFullscreen = !widgetFullscreen;
  }

  onMount(async () => {
    const session = supabase.auth.session();
    if (session) {
      userUuid.set(session.user.id); // Assuming userUuid is a writable store
      await checkAndUpdateStakings();
    }
  });

  async function checkAndUpdateStakings() {
    const uuid = $userUuid; // Accessing the userUuid store value directly

    const { data: stakings, error } = await supabase
      .from('Staking')
      .select('*')
      .eq('uuid', uuid)
      .eq('state', false); // Assuming 'state' is a boolean where false indicates ongoing

    if (error) {
      console.error('Error fetching stakings:', error);
      return; 
    }

    stakings.forEach(async (staking) => {
  const startDate = new Date(staking.created_at); // Ensure this is a valid Date object
  const durationMs = staking.duration; // This should be in milliseconds
  const endDate = new Date(startDate.getTime() + durationMs); // Correctly calculate end date
  const currentDate = new Date();
  console.log(`Start Date: ${startDate}, Duration: ${durationMs}, End Date: ${endDate}, Current Date: ${currentDate}`);


      if (currentDate >= endDate) {
        const { error: updateError } = await supabase
          .from('Staking')
          .update({ state: true }) // Mark as finished
          .eq('id', staking.id);

        if (updateError) {
          console.error('Error updating staking state:', updateError);
          return;
        }

        const { data: userDetails, error: userDetailsError } = await supabase
          .from('UserDetails')
          .select('udBalance')
          .eq('uuid', uuid)
          .single();

        if (userDetailsError) {
          console.error('Error fetching user details:', userDetailsError);
          return;
        }

        const currentBalance = parseFloat(userDetails.udBalance) || 0; // Default to 0 if null/undefined
const winnings = parseFloat(staking.winning) || 0; // Default to 0 if null/undefined
const newBalance = currentBalance + winnings;
console.log(`Updating balance for UUID: ${uuid} with new balance: ${newBalance}`);
console.log(`Current Balance: ${currentBalance}, Winnings: ${winnings}`);




        const { error: balanceUpdateError } = await supabase
          .from('UserDetails')
          .update({ udBalance: newBalance })
          .eq('uuid', uuid);

        if (balanceUpdateError) {
          console.error('Error updating user balance:', balanceUpdateError);
        } else {
          invested.set(newBalance); // Assuming invested is a writable store
        }
      }
    });
  }
</script>

<title>Trade - {$companyName}</title>

<div
	class="relative flex h-full w-full flex-col bg-mainbg pb-2 font-inter lg:flex-row"
>
	<PairsLeft />
	<div class="border-borderColor bg-mainbg p-2 py-2 lg:w-2/4 lg:border-r">
		<div
			class="lg:tradingViewWidgetDesktop my-1 h-72 w-full border-b border-borderColor
				{!widgetFullscreen
				? 'lg:my-0 lg:h-[80vh]'
				: 'fixed top-0 right-0 z-20 flex h-screen w-screen flex-col items-center justify-center px-10 py-8'} 
				"
			id="tradingViewWidget"
		>
			{#if $widgetReady}
				<EmbededTradingViewWidget />
			{/if}
			{#if widgetFullscreen}
				<div class="mt-2 flex w-full flex-col items-center justify-center">
					<button
						on:click={openFullscreen}
						class="buttonSmall w-full text-white">{$t("returnCTA")}</button
					>
					<Logo classNames="mt-6 h-3"></Logo>
				</div>
			{/if}
		</div>
		<div
			class="mt-2 hidden w-full items-center justify-between space-x-2 border border-borderColor bg-mainbg py-2 px-2 lg:flex"
		>
			<button on:click={openFullscreen} class="buttonBig"
				>{$t("homeButton1")}</button
			>

			<a href={$nav.bot} class="buttonBigSecondary  text-center"
				>{$t("investCTA")}</a
			>
		</div>
	</div>
	<PairsRight />
</div>

<div class="mx-2  hidden h-[1px] w-full bg-borderColor lg:block" />
<Footer></Footer>

<style>
	:global(body) {
		background-color: #131722;
	}

	#tradingViewWidget {
		background-color: #131722;
	}

	.tradingViewWidgetDesktop {
		width: calc(50vw - 1rem);
	}
</style>
