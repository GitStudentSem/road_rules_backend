export type SendTicketResult = {
	userId: string;
	ticketId: string;
	questionId: string;
	answerId: string;
};

export type GetQuestionInTicket = { ticketId: string; questionId: string };
