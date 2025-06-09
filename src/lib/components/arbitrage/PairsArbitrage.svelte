<script lang="ts">
    import { Random } from "$lib/logic/random";
    let searchInput: string;
    let active = "BNB";

    import { t } from "$lib/services/i18n";
    import { onMount } from "svelte";

    let symbol: any = "";
    export let exchange: string; // The first exchange
    export let exchange2: string; // The second exchange
    export let bidsExchange1: any = [];
    export let asksExchange1: any = [];
    export let bidsExchange2: any = [];
    export let asksExchange2: any = [];

    let bidsGeneratedExchange1: any = [];
    let asksGeneratedExchange1: any = [];
    let bidsGeneratedExchange2: any = [];
    let asksGeneratedExchange2: any = [];

    let rightNow = "00:00:00";
    let date = new Date();

    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    function getTime() {
        date = new Date();
        rightNow =
            checkTime(date.getHours()) +
            ":" +
            checkTime(date.getMinutes()) +
            ":" +
            checkTime(date.getSeconds());
    }

    function getRandomNumber(min: number, max: number, decimalPlaces: number) {
        const rand = Math.random() * (max - min) + min;
        return rand.toFixed(decimalPlaces);
    }

    function calculateNewPrice(i: any) {
        let number = fixNumber(i);
        let numbered = Number(number);
        let result: any =
            numbered + (numbered / 100) * getRandomNumber(1, 2, 2);
        result = result.toString();
        return result.slice(0, 7);
    }

    function calculateNewPriceAsks(i: any) {
        let number = fixNumber(i);
        let numbered = Number(number);
        let result: any =
            numbered - (numbered / 100) * getRandomNumber(1, 2, 2);
        result = result.toString();
        return result.slice(0, 7);
    }

    function fixNumber(i) {
        if (i === undefined) {
            return ''; // Or some default value
        }
        let number = i.toString();
        return number.slice(0, 7);
    }

    let minValueAsks = 1.12;
    let maxValueAsks = 48.78;

    let minValueBids = 1.12;
    let maxValueBids = 48.78;

    let medianBids: any = 0;
    let medianAsks: any = 0;

    function genRandom(number) {
        let numberGenerated = number;
        let numberAlternate = ((numberGenerated / 100) * 20)
        let result = getRandomNumber(numberAlternate, numberGenerated, 7)

        return result.toString().slice(0, 7)
    }

   function createFabricatedOrderBook(entries: number) {
        const fabricatedBidsExchange1 = [];
        const fabricatedAsksExchange1 = [];
        const fabricatedBidsExchange2 = [];
        const fabricatedAsksExchange2 = [];

        for (let i = 0; i < entries; i++) {
            // Generate random bid and ask prices
            const bidPriceExchange1 = getRandomNumber(minValueBids, maxValueBids, 7);
            const askPriceExchange1 = getRandomNumber(minValueAsks, maxValueAsks, 7);
            const bidPriceExchange2 = getRandomNumber(minValueBids, maxValueBids, 7);
            const askPriceExchange2 = getRandomNumber(minValueAsks, maxValueAsks, 7);

            // Generate random bid and ask amounts (you can adjust the range)
            const bidAmountExchange1 = getRandomNumber(0.1, 10, 2);
            const askAmountExchange1 = getRandomNumber(0.1, 10, 2);
            const bidAmountExchange2 = getRandomNumber(0.1, 10, 2);
            const askAmountExchange2 = getRandomNumber(0.1, 10, 2);

            // Push the generated values to the order book arrays
            fabricatedBidsExchange1.push([bidPriceExchange1, bidAmountExchange1]);
            fabricatedAsksExchange1.push([askPriceExchange1, askAmountExchange1]);
            fabricatedBidsExchange2.push([bidPriceExchange2, bidAmountExchange2]);
            fabricatedAsksExchange2.push([askPriceExchange2, askAmountExchange2]);
        }

        console.log("fabricatedBidsExchange1", fabricatedBidsExchange1);
        console.log("fabricatedAsksExchange1", fabricatedAsksExchange1);
        console.log("fabricatedBidsExchange2", fabricatedBidsExchange2);
        console.log("fabricatedAsksExchange2", fabricatedAsksExchange2);

           bidsExchange1 = fabricatedBidsExchange1;
    asksExchange1 = fabricatedAsksExchange1;
    bidsExchange2 = fabricatedBidsExchange2;
    asksExchange2 = fabricatedAsksExchange2;
    }

		
    console.log("bidsExchange1 length:", bidsExchange1.length);
    console.log("bidsExchange2 length:", bidsExchange2.length);
    console.log("asksExchange1 length:", asksExchange1.length);
    console.log("asksExchange2 length:", asksExchange2.length);

    // Call the function to create the fabricated order book with a specified number of entries
    createFabricatedOrderBook(10); // You can change the number of entries as needed

    $: bidsExchange1, bidsExchange2, getTime();
</script>

<div class="flex flex-col space-y-2 p-2 text-left lg:flex-row lg:space-x-4 lg:space-y-0 lg:p-4">
    <div>
        <p class="mb-2 text-sm">{exchange}</p>

        <div class="flex h-8 items-center whitespace-nowrap border-[0.5px] border-borderColor bg-mainbg text-xs text-white">
            <p class="w-4/12 pl-2 font-medium">{$t("homeRPrice")}</p>
            <p class="w-4/12  font-medium">{$t("homeRAmount")} ({symbol})</p>
            <p class="w-4/12 pr-2 text-right font-medium">{$t("homeRTimestamp")}</p>
        </div>

        <div class="noScroll h-12 overflow-auto text-white lg:h-24">
            <table id="pairsLeft" class="relative m-0 w-full table-fixed text-sm ">
                <tbody class="noScroll text-xs">
                    {#each bidsExchange1 as bid, i}
                        <tr class="h-6 border-x-[0.5px] border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg">
                            <td class="w-4/12 pl-2 text-loss">{fixNumber(bid[0])}</td>
                            <td class="w-4/12 ">{fixNumber(bid[1])}</td>
                            <td class="w-4/12 pr-2 text-right">{rightNow}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <div class="noScroll h-12 overflow-auto border-y-[0.5px] border-borderColor text-white lg:h-24">
            <table id="pairsLeft" class="relative m-0 w-full table-fixed text-sm">
                <tbody class="noScroll text-xs">
                    {#each asksExchange1 as ask, i}
                        <tr class="h-6 border-x-[0.5px] border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg">
                            <td class="w-4/12 pl-2 text-gain">{fixNumber(ask[0])}</td>
                            <td class="w-4/12 ">{fixNumber(ask[1])}</td>
                            <td class="w-4/12 pr-2 text-right">{rightNow}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
    <div>
        <p class="mb-2 text-sm">{exchange2}</p>

        <div class="flex h-8 items-center whitespace-nowrap border-[0.5px] border-borderColor bg-mainbg text-xs text-white">
            <p class="w-4/12 pl-2 font-medium">{$t("homeRPrice")}</p>
            <p class="w-4/12  font-medium">{$t("homeRAmount")} ({symbol})</p>
            <p class="w-4/12 pr-2 text-right font-medium">{$t("homeRTimestamp")}</p>
        </div>

        <div class="noScroll h-12 overflow-auto text-white lg:h-24">
            <table id="pairsLeft" class="relative m-0 w-full table-fixed text-sm ">
                <tbody class="noScroll text-xs">
                    {#each bidsExchange2 as bid, i}
                        <tr class="h-6 border-x-[0.5px] border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg">
                            <td class="w-4/12 pl-2 text-loss">{fixNumber(bid[0])}</td>
                            <td class="w-4/12 ">{fixNumber(bid[1])}</td>
                            <td class="w-4/12 pr-2 text-right">{rightNow}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <div class="noScroll h-12 overflow-auto border-y-[0.5px] border-borderColor text-white lg:h-24 ">
            <table id="pairsLeft" class="relative m-0 w-full table-fixed text-sm ">
                <tbody class="noScroll text-xs">
                    {#each asksExchange2 as ask, i}
                        <tr class="h-6 border-x-[0.5px] border-borderColor odd:bg-secondarybg odd:bg-opacity-50 odd:hover:bg-opacity-100 even:hover:bg-secondarybg">
                            <td class="w-4/12 pl-2 text-gain">{fixNumber(ask[0])}</td>
                            <td class="w-4/12 ">{fixNumber(ask[1])}</td>
                            <td class="w-4/12 pr-2 text-right">{rightNow}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
