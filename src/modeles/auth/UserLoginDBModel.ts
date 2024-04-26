export type UserLoginDBModel = {
	email: string;
	firstName: string;
	secondName: string;
	passwordHash: string;
	_id: string;
	results: {
		/** key format: ticket-n где n - это число */
		[key: string]: number[] | undefined;
		exam?: number[];
	};
};
