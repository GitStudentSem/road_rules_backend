import type { Question } from "../Question";

export type SendExamViewModel = {
	question: string;
	img: string;
	ticketNumber: number;
	answers: Question[];
};
