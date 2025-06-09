<script lang="ts">
  import {
    companyEmail,
    companyName,
    userSurname,
    userAddress,
    userCity,
    userEmail,
    userName,
    userZipCode,
    userCountry,
    userPhoneNumber,
    userReferalCode,
    userUuid,
    userSignUpReferalCode,
  } from "$lib/stores/store";
  import { t } from "$lib/services/i18n";
  import { nav } from "$lib/stores/nav";
  import Select from "svelte-select";
  import { countryList } from "$lib/stores/countryDataset";
  import supabase from "$lib/db";
	import Footer from "$lib/components/Footer.svelte";
  import { onMount } from "svelte";
  import { loadReferals, loadReferalsTable } from "$lib/stores/referalTeam";
  import { bind, to_number } from "svelte/internal";
  import { goto } from "$app/navigation";

  let userCreationDate = "";
  async function getUserCreationDate() {
    const userId = supabase.auth.user();
    const dateMS = await Date.parse(userId?.created_at);
    var s = new Date(dateMS).toLocaleDateString("en-US");
    userCreationDate = s;
  }
  let SignUpReferalCode: string;
  function handleSelect(event) {
    value = event.detail.value;
  }
  async function uploadDB() {
    console.log("done");
    const userId = supabase.auth.user();
    const { data, error } = await supabase
      .from("Users")
      .update({ uSignUpReferalCode: SignUpReferalCode })
      .match({ uuid: userId?.id });
    if (error) {
      console.error(error);
    }
  }

  onMount(async () => {
    getUserCreationDate();
  });

  let value = "";
  let phoneNumber: string;
  let firstName: string;
  let lastName: string;
  let emailAddress: string;
  let address: string;
  let city: string;

  function resetFields() {
    firstName = "";
    lastName = "";
    city = "";
    phoneNumber = "";
    address = "";
    zipCode = "";
    value = "";
    emailAddress = "";
  }
  function convertMSToDate(time: number) {
    let date = new Date(time).toDateString();
    return date;
  }

  function generateReferralCode() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let referralCode = "";
    for (let i = 0; i < 6; i++) {
      referralCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return referralCode;
  }
  async function updateReferalCode() {
    const userId = supabase.auth.user();
    let referalCode = generateReferralCode();
    const { data, error } = await supabase
      .from("Users")
      .update({ uReferalCode: referalCode })
      .match({ uuid: userId?.id });
    if (error) {
      console.error(error);
    }
  }

  function referalCodeUpdate(referal: any) {
    if ($userReferalCode === null || $userReferalCode === undefined) {
      updateReferalCode();
    }
  }

  const updateUserInfo = async () => {
    const userId = supabase.auth.user();

    if (firstName) {
      const { data, error } = await supabase
        .from("Users")
        .update({ uFname: firstName })
        .match({ uuid: userId?.id });
      if (error) {
        console.error(error);
      }
    }
    if (lastName) {
      const { data, error } = await supabase
        .from("Users")
        .update({ uLname: lastName })
        .match({ uuid: userId?.id });
    }

    if (city) {
      const { data, error } = await supabase
        .from("UserDetails")
        .update({ udCity: city })
        .match({ uuid: userId?.id });
      if (error) {
        console.error(error);
      }
    }
    if (phoneNumber) {
      const { data, error } = await supabase
        .from("UserDetails")
        .update({ udMobileNumber: phoneNumber })
        .match({ uuid: userId?.id });
      if (error) {
        console.error(error);
      }
    }
    if (address) {
      const { data, error } = await supabase
        .from("UserDetails")
        .update({ udAddress: address })
        .match({ uuid: userId?.id });
      if (error) {
        console.error(error);
      }
    }
    if (zipCode) {
      const { data, error } = await supabase
        .from("UserDetails")
        .update({ udZipCode: zipCode })
        .match({ uuid: userId?.id });
      if (error) {
        console.error(error);
      }
    }
    if (value) {
      const { data, error } = await supabase
        .from("UserDetails")
        .update({ udCountry: value })
        .match({ uuid: userId?.id });
      if (error) {
        console.error(error);
      }
    }
    window.location.reload();

    // await supabase.from('User Details').update('')
  };
  let referalCount = 0;

  async function getReferalCount(any) {
    const { count, error } = await loadReferals(any);
    if (error) {
      console.error(error);
    } else {
      referalCount = count;
    }
  }
</script>

<title>My Referal Code - {$companyName}</title>
<div
  class="flex min-h-screen flex-col justify-center bg-mainbg font-inter md:flex-row"
>
  <div class="flex flex-col px-2 pb-10 pt-10 lg:w-8/12 lg:px-4">
    <div
      class="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between"
    >
      <div class="flex items-center space-x-8">
        <div
          class="flex h-20 w-20 items-center justify-center rounded-full border border-borderColor bg-secondarybg lg:h-40 lg:w-40"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-1/3 w-1/3 stroke-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div class="text-white ">
          <p class="text-2xl text-main">{$userName} {$userSurname}</p>
          <p class="mt-1 text-sm ">
            {$companyName} User since {userCreationDate}
          </p>
        </div>
      </div>
      <div class="mt-8 space-y-2 text-center lg:space-y-4">
        <a href="/" rel="_external" class="buttonBig hidden px-8 lg:block"
          >Return to homepage</a
        >
        <a href={$nav.bot} class=" buttonBigGain block">Invest Now</a>
        <a href={$nav.reset} class="buttonBig block lg:hidden"
          >Change Password</a
        >
      </div>
    </div>
    <div class="w-full text-sm" />
    <div class="mt-16 flex h-full w-full flex-col space-y-4 text-white ">
      <div
        class="flex w-full flex-col space-y-2 lg:flex-row lg:space-x-4 lg:space-y-0"
      >
        <div class="w-full lg:w-1/2">
          <p class="mb-2">{$t("referalcode")}</p>
          {#await referalCodeUpdate($userReferalCode)}
            <p class="inputInitial text-sm">Loading...</p>
          {:then count}
            <p class="inputInitial text-sm">{$userReferalCode}</p>
          {:catch error}
            <p>Error: {error.message}</p>
          {/await}
        </div>
        <div class="w-full lg:w-1/2">
          <p class="mb-2">{"Friend Referal Code"}</p>
          <!-- {#if $userSignUpReferalCode !== null && $userSignUpReferalCode !== undefined}
            <p class="inputInitial text-sm">{$userSignUpReferalCode}</p>
          {:else}
            <input type="text" class="inputInitial" placeholder="Enter referral code" bind:value={SignUpReferalCode}><button on:click={uploadDB}>Upload</button>
            <form
              on:submit={async (e) => { e.preventDefault(); return await uploadDB(); }}
              autocomplete="one-time-code"
            >
              <input
                type="text"
                class="inputInitial"
                placeholder="Enter referral code"
                bind:value={SignUpReferalCode}
              />
              <button type="submit">Upload</button>
            </form>
          {/if} -->
          <form on:submit|preventDefault={uploadDB}>
            {#if $userSignUpReferalCode !== null && $userSignUpReferalCode !== undefined}
              <p class="inputInitial text-sm">{$userSignUpReferalCode}</p>
            {:else}
              <div class="input-container">
                <input
                  type="text"
                  class="inputInitial "
                  placeholder="Enter referral code"
                  bind:value={SignUpReferalCode}
                />
                <button type="submit" class="submit-button">&#10003;</button>
              </div>
            {/if}
          </form>
        </div>
        <div class="w-full">
          <p class="mb-2">{$t("referalteam")}</p>

          {#await getReferalCount($userReferalCode)}
            <p class="inputInitial text-sm">Loading...</p>
          {:then count}
            <p class="inputInitial text-sm">
              {referalCount > 0 ? referalCount : 0}
            </p>
          {:catch error}
            <p>Error: {error.message}</p>
          {/await}
        </div>
      </div>
      <table class="w-full text-left text-sm text-gray-400 ">
        <thead
          class="border-b border-borderColor bg-secondarybg text-xs uppercase text-gray-400"
        >
          <tr>
            <th scope="col" class="px-4 py-3 pl-4">SL</th>
            <th scope="col" class="px-4 py-3">{$t("name")}</th>
            <th scope="col" class="px-4 py-3">{$t("emailAddress")}</th>
            <th scope="col" class="px-4 py-3">{$t("dateJoined")}</th>
          </tr>
        </thead>
        <tbody>
          {#await loadReferalsTable($userReferalCode)}
            <tr
              class="border-borderColor bg-mainbg odd:bg-mainbg even:bg-secondarybg even:bg-opacity-50 odd:hover:bg-secondarybg even:hover:bg-opacity-100"
            >
              <td class="px-4 py-4 pl-4">Loading</td>
              <td class="px-4 py-4">Loading</td>
              <td class="px-4 py-4">Loading</td>
              <td class="px-4 py-4">Loading</td>
            </tr>
          {:then data}
            {#each data as referal, i}
              <tr
                class="border-borderColor bg-mainbg odd:bg-mainbg even:bg-secondarybg even:bg-opacity-50 odd:hover:bg-secondarybg even:hover:bg-opacity-100"
              >
                <td class="px-4 py-4 pl-4">{i + 1}</td>
                <td class="px-4 py-4">{referal.name}</td>
                <td class="px-4 py-4">{referal.email}</td>
                <td class="px-4 py-4">{convertMSToDate(referal.dateJoined)}</td>
              </tr>
            {/each}
          {:catch error}
            <p>{error.message}</p>
          {/await}
        </tbody>
      </table>
    </div>
  </div>
</div>
<Footer></Footer>
<style>
  .input-container {
    position: relative;
  }

  .submit-button {
   position: absolute;
    top: 50%;
    right: 25px;
    transform: translateY(-50%);
    font-size: 1.5em;
    line-height: 1;
    font-weight: bold;
    text-align: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    color: #fff;
    border: none;
    outline: none;
    cursor: pointer;
  }
</style>
