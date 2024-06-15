import type { Answer } from "../Answer";

export type CreateQuestionDBModel = {
	imgInfo: { img: string; hash: string };
	questionId: string;
	question: string;
	help: string;
	answers: Answer[];
};
