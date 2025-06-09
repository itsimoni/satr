import supabase from "$lib/db";
import { writable } from "svelte/store";
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
  } from "$lib/stores/store";


export const loadReferalTeam = async (userReferalCode: string) => {
  const { data, error } = await supabase
    .from("Users")
    .select()
    .eq("uSignUpReferalCode", userReferalCode)
    .order("uId", { ascending: false });

  if (error) {
    console.error(error);
    return { data: [], error: error.message };
  }

  return { data, error: null };
};

export const loadReferals = async (userReferalCode: any) => {
  const { data, error } = await loadReferalTeam(userReferalCode);

  if (error) {
    console.error(error);
    return { count: 0, error: error.message };
  }

  return { count: data.length, error: null };
};

export const loadReferalsTable = async (referalCode: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from("Users")
    .select("uFname,uLname, uEmail, created_at")
    .eq("uSignUpReferalCode", referalCode)
    .order("uId", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  const referalTeam = data.map((user: any, index: number) => ({
    sl: index + 1,
    name: `${user.uFname} ${user.uLname}`,
    email: user.uEmail,
    dateJoined: user.created_at,
  }));

  return referalTeam;
};
