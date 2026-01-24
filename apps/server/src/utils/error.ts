export const commonCatch = (e: unknown) => {
	console.error(e);
	throw e;
};
