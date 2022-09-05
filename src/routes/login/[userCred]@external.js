/** @type {import('@sveltejs/kit').RequestHandler} */
export const get = async ({ params }) => {
	const userCred = params.userCred;
	return {
		body: {
			userCred: userCred,
		},
	};
};