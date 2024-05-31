import type { CreateQuestionDBModel } from "./CreateQuestionDBModel";

export type TicketsDBModel = {
	ticketId: string;
	questions: CreateQuestionDBModel[];
};
