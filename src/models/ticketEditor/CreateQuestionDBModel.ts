import type { Answer } from "../Answer";

export type CreateQuestionDBModel = {
	imgInfo: {
		img: string;
		imageOriginalHash: string;
		imagePrcessedHash: string;
	};
	questionId: string;
	question: string;
	help: string;
	answers: Answer[];
};
