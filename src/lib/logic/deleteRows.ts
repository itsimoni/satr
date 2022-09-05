import supabase from "$lib/db";

// tfshihen tgjitha - use i funksionit
export const deleteRow = async (id: any) => {
	
	const { data, error } = await supabase
		.from("TradeHistory")
		.delete()
		.eq( 'tId', id );

	if (error) {
		console.error(error);
	}
};

// * GATI
// DO BEHET RUN VETEM NQS ->
// ka kaluar 12a qe nga hera fundit qe eshte bo login
export const deleteAllRows = async () => {
	const userId = supabase.auth.user();
	const { data, error } = await supabase
		.from("TradeHistory")
		.delete()
		.match({ isDay: false, uuid: userId?.id });
};
