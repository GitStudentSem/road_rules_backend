import type { CreateQuestionDBModel } from "./CreateQuestionDBModel";

export type TicketsDBModel = {
	ticketId: string;
	createdAt: number;
	questions: CreateQuestionDBModel[];
};
