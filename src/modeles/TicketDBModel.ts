export type TicketDBModel = {
	img: string;
	question: string;
	answers: {
		text: string;
		isCorrect: boolean;
	}[];
	help: string;
};
