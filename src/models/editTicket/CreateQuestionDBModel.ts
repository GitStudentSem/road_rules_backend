import type { Question } from "../Question";

export type CreateQuestionDBModel = {
	img: string;
	questionId: string;
	question: string;
	help: string;
	answers: Question[];
};
