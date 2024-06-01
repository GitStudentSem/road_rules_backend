import type { Question } from "../Question";

export type CreateQuestionDBModel = {
	img?: string;
	ticketId: string;
	question: string;
	help: string;
	answers: Question[];
};
