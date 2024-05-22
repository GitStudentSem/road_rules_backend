export type SendTicketViewModel = {
	question: string;
	img: string;
	answers: {
		answerText: string;
		id: string;
	}[];
};
