export type SendComment = {
	ticketId: string;
	questionId: string;
	text: string;
};

export type GetAllComments = {
	ticketId: string;
	questionId: string;
};

export type DeleteComment = {
	ticketId: string;
	questionId: string;
};
