import type { Answer } from "../Answer";

export type CreateQuestionDBModel = {
	img: string;
	questionId: string;
	question: string;
	help: string;
	answers: Answer[];
};
