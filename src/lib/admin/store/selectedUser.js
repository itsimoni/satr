import { writable } from "svelte/store";

export let selectedUser = writable('');
export let selectedUserDeposits = writable('');
export let selectedUserWithdrawals = writable('');