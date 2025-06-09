<script lang="ts">
    import { activePair, asksBook, bidsBook, pairs } from "$lib/stores/pairs";
    import { t } from "$lib/services/i18n";
    import { onMount } from "svelte";
    import { companyWebsite } from "$lib/stores/store";

    let changePerc = 3.163;
    let changeAsksPerc = 2.172;
    let date = new Date();
   let bids = [];
  let asks = [];
  let rightNow;

  // Function to generate random order data
  function generateOrderData(minPrice, maxPrice, minAmount, maxAmount, count) {
    return Array.from({ length: count }, () => ({
      price: (Math.random() * (maxPrice - minPrice) + minPrice).toFixed(5),
      amount: (Math.random() * (maxAmount - minAmount) + minAmount).toFixed(5),
    }));
  }

  // Function to refresh the order book
  function refreshOrderBook() {
    const minBidPrice = 0.05068;
    const maxBidPrice = 0.05077;
    const minAskPrice = 0.05078;
    const maxAskPrice = 0.05087;
    const minAmount = 1.0;
    const maxAmount = 50.0;
    const count = 10;

    bids = generateOrderData(minBidPrice, maxBidPrice, minAmount, maxAmount, count);
    asks = generateOrderData(minAskPrice, maxAskPrice, minAmount, maxAmount, count);

    // Update the timestamp
    rightNow = new Date().toTimeString().split(' ')[0];
  }

  // Initialize the order book on component mount
  refreshOrderBook();
</script>

<div class="border-borderColor bg-mainbg lg:w-1/4">
  <div class="px-2 lg:pt-2">
    <div class="w-full">
      <div
        class="mb-2 flex h-12 items-center justify-between bg-secondarybg p-2 text-sm font-medium text-white"
      >
        <p>{$t("homeROrderBook")}</p>
        <button class="text-xs" on:click={refreshOrderBook}>Refresh Orders</button>
      </div>
      <div class="my-2 h-[1px] w-full bg-secondarybg" />

      <div
        class="mb-2 flex h-8 items-center justify-between border border-borderColor bg-mainbg text-sm font-medium text-white"
      >
        <p class="px-2 text-xs">{$t("homeRBids")}</p>
      </div>
      <div
        class="flex h-12 items-center whitespace-nowrap border border-borderColor bg-mainbg text-xs text-white"
      >
        <p class="w-4/12 pl-2 font-medium">{$t("homeRPrice")}</p>
        <p class="w-2/12 font-medium">{$t("homeRAmount")}</p>
        <p class="w-6/12 pr-2 text-right font-medium">
          {$t("homeRTimestamp")} (Received)
        </p>
      </div>
      <div
        class="noScroll h-[17vh] overflow-auto border-b border-borderColor text-white lg:h-[34vh]"
      >
        <table class="relative m-0 w-full table-fixed text-sm">
          <tbody class="noScroll overflow-auto text-xs">
            {#each bids as bid}
              <tr
                class="h-8 border-x border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg"
              >
                <td class="w-4/12 pl-2 text-loss">{bid.price}</td>
                <td class="w-2/12">{bid.amount}</td>
                <td class="w-6/12 pr-2 text-right">{rightNow}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <div class="my-2 h-[1px] w-full bg-secondarybg" />

      <div
        class="mb-2 mt-2 flex h-8 items-center justify-between border border-borderColor bg-mainbg text-sm font-medium text-white"
      >
        <p class="px-2 text-xs">{$t("homeRAsks")}</p>
      </div>
      <div
        class="flex h-12 items-center whitespace-nowrap border border-borderColor bg-mainbg text-xs text-white"
      >
        <p class="w-4/12 pl-2 font-medium">{$t("homeRPrice")}</p>
        <p class="w-2/12 font-medium">{$t("homeRAmount")}</p>
        <p class="w-6/12 pr-2 text-right font-medium">
          {$t("homeRTimestamp")} (Received)
        </p>
      </div>
      <div
        class="noScroll h-[17vh] overflow-auto border-b border-borderColor text-white lg:h-[34vh]"
      >
        <table class="relative m-0 w-full table-fixed text-sm">
          <tbody class="noScroll overflow-auto text-xs">
            {#each asks as ask}
              <tr
                class="h-8 border-x border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg"
              >
                <td class="w-4/12 pl-2 text-gain">{ask.price}</td>
                <td class="w-2/12">{ask.amount}</td>
                <td class="w-6/12 pr-2 text-right">{rightNow}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>