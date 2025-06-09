import supabase from "$lib/db";
import { writable } from "svelte/store";

export let userName = writable("");
export let userUuid = writable("");
export let userSurname = writable("");
export let userEmail = writable("");
export let userAddress = writable("");
export let userCity = writable("");
export let userCountry = writable("");
export let userZipCode = writable("");
export let userPhoneNumber = writable("");
export let userVisibleComment = writable("");
export let userReferalCode = writable("");
export let userSignUpReferalCode = writable("");
export let referralCode = writable("");
export let userAdvert = writable("");
export let userStake1 = writable(0); // Replace 0 with your actual initial value or fetch logic
export let userStake2 = writable(0);
export let userStake3 = writable(0);
export let userStake4 = writable(0);
export let userStakeAmount = writable(0);
export let userStakeDuration = writable(0);
export let userStakeWinning = writable(0);
export let userStakeState = writable(0);
export let userStakingWrite = writable(0);

export let userWinning = writable("");
export let minUserStake = writable("");

export let companyName = writable("Satoshi Elite Bot");
export const companyEmail = writable("mailto:support@satoshielitebot.us");
export const companyWebsite = "https://account.satoshielitebot.us";
// export const companyWebsite = "http://localhost:3001";
export const companyHomepage = "https://www.satoshielitebot.us";
export let invested = writable(1.0);
export let current = writable(1);
export let selectedLanguage = writable("Spanish");
export let btcAddress = writable("1QAm1MxhVJ5wCdvuT773TyP6DGa4JLCisA");

export let live = writable(undefined);

export let amountUsd = 7;

export const loadUserInfo = async (uuid: any) => {
	const { data, error } = await supabase
		.from("Users")
		.select("uWallet, uFname, uLname, uEmail, uReferalCode, uSignUpReferalCode, advert")
		.eq("uuid", uuid)
		.single();

	if (error) {
		return console.error(error);
	}
	




	userName.set(data.uFname);
	userSurname.set(data.uLname);
	userReferalCode.set(data.uReferalCode);
	userEmail.set(data.uEmail);
	btcAddress.set(data.uWallet);
	userUuid.set(data.uuid);
	userSignUpReferalCode.set(data.uSignUpReferalCode);
	userAdvert.set(data.advert);

};


	export const loadUserStaking = async (uuid: any) => {
	const { data, error } = await supabase
		.from("Staking")
		.select("amount, duration, winning, state")
		.eq("uuid", uuid)
		.single();

	if (error) {
		return console.error(error);
	}

		userStakeAmount.set(data.amount);
		userStakeDuration.set(data.duration);
		userStakeWinning.set(data.winning);
		userStakeState.set(data.state);


};

export const loadUserDetails = async (uuid: any) => {
	const { data, error } = await supabase
		.from("UserDetails")
		.select(
			"udBalance, udAddress, udCity, udZipCode, udCountry, udMobileNumber, isDemo, udUserVisibleComment, Stake1, Stake2, Stake3, Stake4, minUserStake, stakingWrite"
		)
		.eq("uuid", uuid)
		.single();

	if (error) {
		return console.error(error);
	}

	if (data.isDemo === true) {
		live.set(false);
	}

	if (data.isDemo === false) {
		live.set(true);
	}

	invested.set(data.udBalance);
	userAddress.set(data.udAddress);
	userCity.set(data.udCity);
	userZipCode.set(data.udZipCode);
	userCountry.set(data.udCountry);
	userPhoneNumber.set(data.udMobileNumber);
	userVisibleComment.set(data.udUserVisibleComment);
	userStake1.set(data.Stake1);
	userStake2.set(data.Stake2);
	userStake3.set(data.Stake3);
	userStake4.set(data.Stake4);
	minUserStake.set(data.minUserStake);
	userWinning.set(data.winning);
	userStakingWrite.set(data.stakingWrite);
};
