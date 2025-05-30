export type SendComment = {
	ticketId: string;
	questionId: string;
	text: string;
	time: string;
};

export type SendReplyToComment = {
	/** Корневое сообщение ответов, откуда строится топик */
	rootCommentId: string;
	/** Сообщение кому отправляется ответ */
	replyToCommentId: string;
	ticketId: string;
	questionId: string;
	text: string;
	time: string;
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

export type DisikeComment = {
	ticketId: string;
	questionId: string;
	commentId: string;
};
