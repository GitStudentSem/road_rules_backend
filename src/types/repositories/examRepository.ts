import type { Answer } from "../DBModels";

export type QuestionWithTicketId = {
	imgInfo: {
		img: string;
		imageOriginalHash: string;
		imagePrcessedHash: string;
	};
	questionId: string;
	question: string;
	help: string;
	answers: Answer[];
	ticketId: string;
};

export type SendExamAnswer = {
	userId: string;
	ticketId: string;
	questionId: string;
	answerId: string;
};

export type SetAlwaysCompleteExam = {
	email: string;
	isAlwaysComplete: boolean;
};
