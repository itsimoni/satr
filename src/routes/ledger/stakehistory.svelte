<script lang="ts">
  import { onMount} from 'svelte';
	import { writable } from 'svelte/store';
  import supabase from '$lib/db';
  import { userUuid } from '$lib/stores/store'; // Assuming this store contains the logged-in user's UUID
  import Footer from '$lib/components/Footer.svelte';
  import { t } from "$lib/services/i18n";
  import { companyName } from '$lib/stores/store';

  let stakingHistory = writable([]);

onMount(async () => {
    const session = supabase.auth.session();
    if (session && session.user) {
        const { data, error } = await supabase
            .from('Staking')
            .select('*')
            .eq('uuid', session.user.id);
						

        if (error) {
            console.error('Error fetching staking history:', error);
        } else {
            stakingHistory.set(data.map(item => {
                const startDate = new Date(item.created_at);
                const endDate = new Date(startDate.getTime() + parseInt(item.duration));
                const status = item.state ? "Finished" : "Ongoing"; // Assuming 'state' is a boolean
                return {
                    ...item,
                    end_date: endDate.toISOString(),
                    status // Add status to each item
                };
            }));
        }
    } else {
        console.error("No user session found.");
    }
});



async function loadStakingHistory(uuid) {
  console.log("Fetching staking history for UUID:", uuid);
  const { data, error } = await supabase.from('Staking').select('*').eq('uuid', uuid);

  if (error) {
    console.error('Error fetching staking history:', error);
  } else if (data.length === 0) {
    console.log('No staking history found for the user.');
  } else {
    console.log('Fetched staking history:', data);
    stakingHistory.set(data);
  }
}

function convertMSToDate(isoString) {
    return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

</script>



<title>Staking History - {$companyName}</title>
<div class="flex min-h-screen min-w-full flex-col items-center bg-mainbg pb-12 font-inter">
  <div class="topoBg flex w-full flex-col items-center py-20 text-center">
    <div class="w-8/12">
      <h1 class="textHeading">{$t("stakingHistoryHeading")}</h1>
    </div>
  </div>
  <div class="w-full px-2 lg:w-8/12 lg:px-0">
    <div class="noScroll overflow-x-auto border border-borderColor">
      <table class="w-full text-left text-sm text-gray-400">
        <thead class="border-b border-borderColor bg-secondarybg text-xs uppercase text-gray-400">
          <tr>
            <th scope="col" class="px-4 py-3 pl-4">SL</th>
            <th scope="col" class="px-4 py-3">{$t("stakingHistory1")}</th>
            <th scope="col" class="px-4 py-3">{$t("stakingHistory2")}</th>
            <th scope="col" class="px-4 py-3">{$t("stakingHistory3")}</th>
            <th scope="col" class="px-4 py-3">{$t("stakingHistory4")}</th>
            <th scope="col" class="px-4 py-3">{$t("stakingHistory5")}</th>
          </tr>
        </thead>
        <tbody>
          {#each $stakingHistory as history, i}
            <tr class={`border-borderColor bg-mainbg ${i % 2 === 0 ? 'even:bg-secondarybg even:bg-opacity-50' : 'odd:bg-mainbg'} odd:hover:bg-secondarybg even:hover:bg-opacity-100`}>
              <td class="px-4 py-4 pl-4">{i + 1}</td>
              <td class="px-4 py-4">{convertMSToDate(history.created_at)}</td>
              <td class="px-4 py-4">{history.amount} BTC</td>
              <td class="px-4 py-4">{history.winning} BTC</td>
              <td class="px-4 py-4">{convertMSToDate(history.end_date)}</td>
              <td class={`px-4 py-4 ${history.state ? 'text-gain' : 'text-yellow-400'}`}>
                {history.state ? 'Finished' : 'Ongoing'}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<Footer />