import type { CreateQuestionDBModel } from "../../models/ticketEditor/CreateQuestionDBModel";

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

export type QuestionWithTicketId = CreateQuestionDBModel & {
	ticketId: string;
};
