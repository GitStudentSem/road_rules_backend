export type SendComment = {
	ticketId: string;
	questionId: string;
	text: string;
};

export type SendReplyToComment = {
	ticketId: string;
	questionId: string;
	text: string;
	/** Корневое сообщение ответов, откуда строится топик */
	rootMessageId: string;
	/** Сообщение кому отправляется ответ */
	replyToMessageId: string;
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
