import type { Question } from "../Question";

export type SendTicketViewModel = {
	question: string;
	img: string;
	answers: Question[];
};
