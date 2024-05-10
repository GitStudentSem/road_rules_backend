export type SendExamViewModel = {
	question: string;
	img: string;
	ticketNumber: number;
	answers: { answerText: string; id: string }[];
};
