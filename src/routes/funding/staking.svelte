<script lang="ts">
  import { onMount } from 'svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { derived, writable } from 'svelte/store';
  import supabase from '$lib/db';
  import { invested, companyName, minUserStake, userStake1, userStake2, userStake3, userStake4, userStakingWrite } from '$lib/stores/store';
	import { t } from '$lib/services/i18n';

  const userUuid = writable(null);
  let message = writable({ text: '', type: '' }); // Use this for both success and error messages
  const stakingOptions = writable([]);
  const conversionRate = writable(0);
  const stakingAmount = writable(0);
  let selectedStakeOption = '';

  onMount(async () => {
    const session = supabase.auth.session();
    userUuid.set(session?.user?.id ?? null);
    if (session) {
      await calculateConversionRate();
      initializeStakingOptions();
    } else {
      message.set({ text: "No user is logged in.", type: 'error' });
    }
  });

  $: if ($userStake1 && $userStake2 && $userStake3 && $userStake4) {
    stakingOptions.set([
      { period: $t("1Month"), rate: $userStake1, duration: 30 * 24 * 60 * 60 * 1000, selected: false },
      { period: $t("3Month"), rate: $userStake2, duration: 3 * 30 * 24 * 60 * 60 * 1000, selected: false },
      { period: $t("6Month"), rate: $userStake3, duration: 6 * 30 * 24 * 60 * 60 * 1000, selected: false },
      { period: $t("1Year"), rate: $userStake4, duration: 12 * 30 * 24 * 60 * 60 * 1000, selected: false }
    ]);
  }

  async function calculateConversionRate() {
    try {
      const response = await fetch(`https://blockchain.info/tobtc?currency=EUR&value=1`);
      if (!response.ok) throw new Error('Network response was not ok.');
      const rate = await response.json();
      conversionRate.set(1 / rate); // Correcting the conversion rate calculation
    } catch (error) {
      message.set({ text: 'Error fetching exchange rate: ' + error.message, type: 'error' });
    }
  }

  function formatCurrency(value: number) {
    return $conversionRate > 0 ? `€${(value * $conversionRate).toFixed(2)}` : '€0'; // Adjusted to multiply with conversionRate for correct euro amount
  }

  const formattedStakingAmount = derived(
    [stakingAmount, conversionRate],
    ([$stakingAmount, $conversionRate]) => formatCurrency($stakingAmount)
  );

  function formatBitcoin(value: number) {
    return `${value.toFixed(4)} BTC`;
  }

  function setStakingAmount(value: string) {
    stakingAmount.set(parseFloat(value));
  }

  function selectStakingOption(option) {
    selectedStakeOption = option.period;
    stakingOptions.update(options => options.map(o => ({ ...o, selected: o.period === option.period })));
  }

  async function startStaking() {
    const uuid = $userUuid;
    const amount = $stakingAmount;

    if (amount <= 0 || !selectedStakeOption) {
      message.set({ text: "Please select an amount and a staking option.", type: 'error' });
      return;
    }

    const selectedOption = $stakingOptions.find(o => o.period === selectedStakeOption);
    if (!selectedOption) {
      message.set({ text: "Invalid staking option.", type: 'error' });
      return;
    }

    const amountInEuros = $stakingAmount * $conversionRate;
    if (amountInEuros < $minUserStake) {
      message.set({ text: `The minimum staking amount is €${$minUserStake.toFixed(2)}.`, type: 'error' });
      return;
    }

    if (amount > $invested) {
      message.set({ text: "Insufficient balance for staking.", type: 'error' });
      return;
    }

    const potentialWinningsBTC = amount + (amount * (selectedOption.rate / 100));
    const potentialWinningsEuros = potentialWinningsBTC * $conversionRate; // Convert winnings to euros
    const newBalance = $invested - amount;
    invested.set(newBalance);

    try {
      const { error: updateError } = await supabase
        .from('UserDetails')
        .update({ udBalance: newBalance })
        .eq('uuid', uuid);

      if (updateError) {
        message.set({ text: 'Failed to update balance: ' + updateError.message, type: 'error' });
        return;
      }

      const { error: insertError } = await supabase
        .from('Staking')
        .insert([{ uuid: uuid, amount: amount, duration: selectedOption.duration, winning: potentialWinningsBTC }]);

      if (insertError) {
        message.set({ text: 'Failed to insert staking record: ' + insertError.message, type: 'error' });
        return;
      }

      message.set({ text: `Successfully staked €${amountInEuros.toFixed(2)} for ${selectedOption.period}. Potential winnings: €${potentialWinningsEuros.toFixed(2)}.`, type: 'success' });

      // Keeping clearStakingInput commented out to ensure the message stays visible
      clearStakingInput();
    } catch (error) {
      message.set({ text: 'Failed to process staking. Please try again.', type: 'error' });
    }
  }

  // Optionally, reactivate clearStakingInput function if needed
  function clearStakingInput() {
    stakingAmount.set(0);
    stakingOptions.update(options => options.map(o => ({ ...o, selected: false })));
    // message.set({ text: '', type: '' }); // Clear any message
  }
</script>



<title>Stake - {$companyName}</title>

<div class="flex h-full grow flex-col justify-between bg-mainbg font-inter md:flex-row">
  <div class="flex h-[95vh] w-full flex-col justify-between px-4 pt-10 md:w-1/2">
    <div>
      <h2 class="textHeading text-white">{$t("stakingHeading")}</h2>
			
      <div class="break-words my-4 text-lg text-white pt-11">{$t("stakingBalanceHeading")}: {formatBitcoin($invested)} / {formatCurrency($invested)}</div>
      <div class="space-y-6">
        <div>
          <input type="range" class="slider w-4/5 max-w-3xl bg-gray-800 opacity-70 my-2.5" min="0" max={$invested} step="0.0001" bind:value={$stakingAmount} on:input="{e => $stakingAmount = parseFloat(e.target.value)}" />
          <div class="break-words my-4 text-lg text-white">{$t("stakingAmountHeading")}: {formatBitcoin($stakingAmount)} / {formatCurrency($stakingAmount)}</div>
        </div>
        <div class="flex flex-wrap justify-center gap-4 mb-6">
       {#each $stakingOptions as option}
    <button 
      class={`buttonBigSecondary whitespace-nowrap px-8 ${option.selected ? 'selected' : ''}`} 
      on:click={() => selectStakingOption(option)}>
      {option.period} - {option.rate}% {#if $userStakingWrite}+ Crypto Trading{/if}
    </button>
  {/each}
        </div>
				   {#if $message.text}
        <div class={`message ${$message.type === 'success' ? 'break-words my-4 text-lg text-green-500' : 'break-words my-4 text-lg text-white pt-1'}`}>
          {$message.text}
        </div>
      {/if}
        <div class="lg:absolute lg:bottom-4 my-4 lg:mt-12 mt-48 inline-flex space-x-4 lg:left-4 md:my-0">
          <button class="buttonBig px-8 hover:bg-buttonHover active:bg-buttonActive" on:click={startStaking}>
            {$t("stakingFirstButton")}
          </button>
          <button class="buttonBigSecondary whitespace-nowrap px-8 hover:bg-buttonHoverSecondary active:bg-buttonActiveSecondary" on:click={clearStakingInput}>
            {$t("stakingSecondButton")}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="topoBg mt-12 flex w-full flex-col items-center justify-center bg-secondarybg py-14 md:mt-0 md:w-2/5">
    <!-- Additional content for the right side can be added here -->
  </div>
</div>

<Footer />

<style>
  .selected {
    background-color: #242733;
  }
</style>
