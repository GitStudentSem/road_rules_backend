import type { Answer } from "../Question";

export type CreateQuestionDBModel = {
	img: string;
	questionId: string;
	question: string;
	help: string;
	answers: Answer[];
};
