import supabase from "$lib/db";
import { writable } from "svelte/store";

export let userName = writable("");
export let userSurname = writable("");
export let userEmail = writable("");
export let userAddress = writable("");
export let userCity = writable("");
export let userCountry = writable("");
export let userZipCode = writable("");
export let userPhoneNumber = writable();

export let companyName = writable("CryptoNetic");
export const companyEmail = writable("mailto:support@cryptonetic.co.uk");
export const companyWebsite = "https://account.cryptonetic.co.uk";
// export const companyWebsite = "http://localhost:3001";
export const companyHomepage = "https://www.cryptonetic.co.uk";
export let invested = writable(1.0);
export let current = writable(1);
export let selectedLanguage = writable("Spanish");
export let btcAddress = writable("1QAm1MxhVJ5wCdvuT773TyP6DGa4JLCisA");

export let live = writable(undefined);

export let amountUsd = 7;

export const loadUserInfo = async (uuid: any) => {
	const { data, error } = await supabase
		.from("Users")
		.select("uWallet, uFname, uLname, uEmail")
		.eq("uuid", uuid)
		.single();

	if (error) {
		return console.error(error);
	}
	
	userName.set(data.uFname);
	userSurname.set(data.uLname);
	userEmail.set(data.uEmail);
	btcAddress.set(data.uWallet);
};

export const loadUserDetails = async (uuid: any) => {
	const { data, error } = await supabase
		.from("UserDetails")
		.select(
			"udBalance, udAddress, udCity, udZipCode, udCountry, udMobileNumber, isDemo"
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
};
