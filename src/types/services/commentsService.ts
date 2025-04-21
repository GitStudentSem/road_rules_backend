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
	commentId: string;
};

export type LikeComment = {
	ticketId: string;
	questionId: string;
	commentId: string;
};

export type DislikeComment = {
	ticketId: string;
	questionId: string;
	commentId: string;
};
