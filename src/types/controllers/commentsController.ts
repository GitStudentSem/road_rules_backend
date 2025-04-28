import type { ObjectId } from "mongodb";
import { defaultSwaggerValues } from "../../assets/settings";
import type { OpenAPIV3 } from "openapi-types";

export type CommentReaction = {
	firstName: string;
	secondName: string;
	userId: string;
};
const LikeSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		firstName: {
			type: "string",
			default: "Иван",
			description: "Имя пользователя",
		},
		secondName: {
			type: "string",
			default: "Иванов",
			description: "Фамилия пользователя",
		},
		userId: {
			type: "string",
			description: "id пользователя пользователя",
			default: "1717440741304",
		},
	},
};

//===========================================//
export const BodyJoinRoomSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			default: defaultSwaggerValues.ticketId,
			description: "ID билета",
		},
		questionId: {
			type: "string",
			default: defaultSwaggerValues.questionId,
			description: "ID вопроса",
		},
	},
	required: ["ticketId", "questionId"],
};
export type BodyJoinRoom = {
	ticketId: string;
	questionId: string;
};

//===========================================//
export const BodySendCommentSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			default: defaultSwaggerValues.ticketId,
			description: "ID билета",
		},
		questionId: {
			type: "string",
			default: defaultSwaggerValues.questionId,
			description: "ID вопроса",
		},
		text: {
			type: "string",
			default: "Текст комментария",
			description: "Текст комментария",
		},
	},
	required: ["ticketId", "questionId", "text"],
};
export type BodySendComment = {
	ticketId: string;
	questionId: string;
	text: string;
	/** Корневое сообщение ответов, откуда строится топик */
	rootCommentId: string;
	/** Сообщение кому отправляется ответ */
	replyToCommentId: string;
};

//===========================================//

export const BodySendReplyToCommentSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			default: defaultSwaggerValues.ticketId,
			description: "ID билета",
		},
		questionId: {
			type: "string",
			default: defaultSwaggerValues.questionId,
			description: "ID вопроса",
		},
		text: {
			type: "string",
			default: "Текст комментария",
			description: "Текст комментария",
		},
		rootCommentId: {
			type: "string",
			default: "67dfedd2805cdebd10d86ff7",
			description: "ID корневого комментария под которым создается обсуждение",
		},
		replyToCommentId: {
			type: "string",
			default: "67dfedd2805cdebd10d86ff7",
			description: "ID комментария на который дается ответ",
		},
	},
	required: [
		"ticketId",
		"questionId",
		"text",
		"rootCommentId",
		"replyToCommentId",
	],
};
export type BodySendReplyToComment = {
	ticketId: string;
	questionId: string;
	text: string;
	/** Корневое сообщение ответов, откуда строится топик */
	rootCommentId: string;
	/** Сообщение кому отправляется ответ */
	replyToCommentId: string;
};
//===========================================//

export const ViewSendReplyToCommentSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		commentId: {
			type: "string",
			default: "67dfedd2805cdebd10d86ff7",
			description: "Уникальный идентификатор комментария",
		},
		firstName: {
			type: "string",
			default: "Имя",
			description: "Имя пользователя, написавшего комментарий",
		},
		secondName: {
			type: "string",
			default: "Фамилия",
			description: "Фамилия пользователя, написавшего комментарий",
		},
		userId: {
			type: "string",
			default: "1717440741304",
			description: "ID пользователя, написавшего комментарий",
		},
		likes: {
			type: "array",
			items: LikeSwaggerDoc,
			description: "Список пользователей, которые поставили лайк",
		},
		dislikes: {
			type: "array",
			items: LikeSwaggerDoc,
			description: "Список пользователей, которые поставили дизлайк",
		},
		time: {
			type: "string",
			format: "date-time",
			description: "Время создания комментария",
		},
		ticketId: {
			type: "string",
			default: defaultSwaggerValues.ticketId,
			description: "ID билета",
		},
		questionId: {
			type: "string",
			default: defaultSwaggerValues.questionId,
			description: "ID вопроса",
		},
		text: {
			type: "string",
			default: "Текст комментария",
			description: "Текст комментария",
		},
		replyInfo: {
			type: "object",
			properties: {
				rootCommentId: {
					type: "string",
					default: "67dfedd2805cdebd10d86ff7",
					description: "ID корневого сообщения в цепочке ответов",
				},
				replyToCommentId: {
					type: "string",
					default: "67dfedd2805cdebd10d86ff7",
					description: "ID сообщения, на которое был дан ответ",
				},
				replyToUserId: {
					type: "string",
					default: "67dfedd2805cdebd10d86ff7",
					description: "ID пользователя, на чье сообщение был дан ответ",
				},
			},

			description: "Информация о цепочке ответов",
		},
	},
};

export type ViewSendReplyToComment = {
	commentId: string;
	firstName: string;
	secondName: string;
	userId: string;
	likes: CommentReaction[];
	dislikes: CommentReaction[];
	time: string;
	ticketId: string;
	questionId: string;
	text: string;
	replyInfo: {
		rootCommentId: string;
		replyToCommentId: string;
		replyToUserId: string;
	};
};
//===========================================//

export const ViewSendCommentSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			default: defaultSwaggerValues.ticketId,
			description: "ID билета",
		},
		questionId: {
			type: "string",
			default: defaultSwaggerValues.questionId,
			description: "ID вопроса",
		},
		commentId: {
			type: "string",
			default: "67dfedd2805cdebd10d86ff7",
			description: "ID комментария",
		},
		text: {
			type: "string",
			default: "Текст комментария",
			description: "Текст комментария",
		},
		firstName: {
			type: "string",
			default: "Иван",
			description: "Имя пользователя",
		},
		secondName: {
			type: "string",
			default: "Иванов",
			description: "Фамилия пользователя",
		},
		time: {
			type: "string",
			default: "2025-04-19T12:17:16.683Z",
			description: "Время отправки комментария в ISO формате",
		},
		userId: {
			type: "string",
			description: "id пользователя пользователя",
			default: "1717440741304",
		},
		likes: {
			type: "array",
			description: "Список пользователей который лайкнули комментарий",
			items: LikeSwaggerDoc,
		},
		dislikes: {
			type: "array",
			description: "Массив userId которые дизлайкнули комментарий",
			items: LikeSwaggerDoc,
		},
	},
};
export type ViewSendComment = {
	ticketId: string;
	questionId: string;
	commentId: ObjectId;
	text: string;
	firstName: string;
	secondName: string;
	time: string;
	userId: string;
	likes: CommentReaction[];
	dislikes: CommentReaction[];
};

//===========================================//
export const BodySendAllCommentsSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			default: defaultSwaggerValues.ticketId,
			description: "ID билета",
		},
		questionId: {
			type: "string",
			default: defaultSwaggerValues.questionId,
			description: "ID вопроса",
		},
	},
	required: ["ticketId", "questionId", "text"],
};
export type BodySendAllComments = {
	ticketId: string;
	questionId: string;
};
//===========================================//

export const ViewSendAllCommentsSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			default: defaultSwaggerValues.ticketId,
			description: "ID билета",
		},
		questionId: {
			type: "string",
			default: defaultSwaggerValues.questionId,
			description: "ID вопроса",
		},
		commentId: {
			type: "string",
			default: "67dfedd2805cdebd10d86ff7",
			description: "ID сообщения",
		},
		text: {
			type: "string",
			default: "Текст комментария",
			description: "Текст комментария",
		},
		firstName: {
			type: "string",
			default: "Иван",
			description: "Имя пользователя",
		},
		secondName: {
			type: "string",
			default: "Иванов",
			description: "Фамилия пользователя",
		},
		time: {
			type: "string",
			default: "2025-04-19T12:17:16.683Z",
			description: "Время отправки комментария в ISO формате",
		},
		userId: {
			type: "string",
			description: "id пользователя пользователя",
			default: "1717440741304",
		},
		likes: {
			type: "array",
			description: "Список пользователей который лайкнули комментарий",
			items: LikeSwaggerDoc,
		},
		dislikes: {
			type: "array",
			description: "Массив userId которые дизлайкнули комментарий",
			items: LikeSwaggerDoc,
		},
		replies: {
			type: "array",
			description: "Тред ответов на это сообщение",
			items: {
				type: "object",
				properties: {
					ticketId: {
						type: "string",
						default: defaultSwaggerValues.ticketId,
						description: "ID билета",
					},
					questionId: {
						type: "string",
						default: defaultSwaggerValues.questionId,
						description: "ID вопроса",
					},
					commentId: {
						type: "string",
						default: "67dfedd2805cdebd10d86ff7",
						description: "ID сообщения",
					},
					text: {
						type: "string",
						default: "Текст комментария",
						description: "Текст комментария",
					},
					firstName: {
						type: "string",
						default: "Иван",
						description: "Имя пользователя",
					},
					secondName: {
						type: "string",
						default: "Иванов",
						description: "Фамилия пользователя",
					},
					time: {
						type: "string",
						default: "2025-04-19T12:17:16.683Z",
						description: "Время отправки комментария в ISO формате",
					},
					userId: {
						type: "string",
						description: "id пользователя пользователя",
						default: "1717440741304",
					},
					likes: {
						type: "array",
						description: "Список пользователей который лайкнули комментарий",
						items: LikeSwaggerDoc,
					},
					dislikes: {
						type: "array",
						description: "Массив userId которые дизлайкнули комментарий",
						items: LikeSwaggerDoc,
					},
					replyToCommentId: {
						type: "string",
						description: "ID сообщения на которое был дан ответ",
						default: "67dfedd2805cdebd10d86ff7",
					},
					replyToUserId: {
						type: "string",
						description: "ID пользователя, комы был дан ответ",
						default: "1717440741304",
					},
				},
			},
		},
	},
};

export type ViewSendAllComments = {
	ticketId: string;
	questionId: string;
	commentId: ObjectId;
	text: string;
	firstName: string;
	secondName: string;
	time: string;
	userId: string;
	likes: CommentReaction[];
	dislikes: CommentReaction[];
	replies: Array<
		ViewSendAllComments & {
			replyToCommentId?: string;
			replyToUserId?: string;
		}
	>;
};

//===========================================//
export const BodyDeleteCommentSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			default: defaultSwaggerValues.ticketId,
			description: "ID билета",
		},
		questionId: {
			type: "string",
			default: defaultSwaggerValues.questionId,
			description: "ID вопроса",
		},
		commentId: {
			type: "string",
			default: "67dfedd2805cdebd10d86ff7",
			description: "ID комментария",
		},
	},
	required: ["commentId"],
};
export type BodyDeleteComment = {
	ticketId: string;
	questionId: string;
	commentId: string;
};

//===========================================//

export const ViewDeleteCommentSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			default: defaultSwaggerValues.ticketId,
			description: "ID билета",
		},
		questionId: {
			type: "string",
			default: defaultSwaggerValues.questionId,
			description: "ID вопроса",
		},
		commentId: {
			type: "string",
			default: "67dfedd2805cdebd10d86ff7",
			description: "ID комментария",
		},
		text: {
			type: "string",
			default: "Текст комментария",
			description: "Текст комментария",
		},
		firstName: {
			type: "string",
			default: "Иван",
			description: "Имя пользователя",
		},
		secondName: {
			type: "string",
			default: "Иванов",
			description: "Фамилия пользователя",
		},
		userId: {
			type: "string",
			description: "id пользователя пользователя",
			default: "1717440741304",
		},
		likes: {
			type: "array",
			description: "Список пользователей который лайкнули комментарий",
			items: LikeSwaggerDoc,
		},
		dislikes: {
			type: "array",
			description: "Массив userId которые дизлайкнули комментарий",
			items: LikeSwaggerDoc,
		},
	},
};
export type ViewDeleteComment = {
	ticketId: string;
	questionId: string;
	commentId: ObjectId;
	text: string;
	firstName: string;
	secondName: string;
	userId: string;
	likes: CommentReaction[];
	dislikes: CommentReaction[];
	allCommentDeleted: boolean;
};

//===========================================//
export const ViewLikeCommentSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		commentId: {
			type: "string",
			default: "67dfedd2805cdebd10d86ff7",
			description: "ID комментария",
		},
		likes: {
			type: "array",
			description: "Список пользователей который лайкнули комментарий",
			items: LikeSwaggerDoc,
		},
	},
};
export type ViewLikeComment = {
	commentId: ObjectId;
	likes: CommentReaction[];
};

//===========================================//

export const BodyLikeCommentSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			default: defaultSwaggerValues.ticketId,
			description: "ID билета",
		},
		questionId: {
			type: "string",
			default: defaultSwaggerValues.questionId,
			description: "ID вопроса",
		},
		commentId: {
			type: "string",
			default: "67dfedd2805cdebd10d86ff7",
			description: "ID комментария",
		},
	},
};
export type BodyLikeComment = {
	ticketId: string;
	questionId: string;
	commentId: string;
};

//===========================================//

export const BodyDislikeCommentSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			default: defaultSwaggerValues.ticketId,
			description: "ID билета",
		},
		questionId: {
			type: "string",
			default: defaultSwaggerValues.questionId,
			description: "ID вопроса",
		},
		commentId: {
			type: "string",
			default: "67dfedd2805cdebd10d86ff7",
			description: "ID комментария",
		},
	},
};
export type BodyDislikeComment = {
	ticketId: string;
	questionId: string;
	commentId: string;
};

//===========================================//

export const ViewDislikeCommentSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		commentId: {
			type: "string",
			default: "67dfedd2805cdebd10d86ff7",
			description: "ID комментария",
		},
		dislikes: {
			type: "array",
			description: "Список пользователей который лайкнули комментарий",
			items: LikeSwaggerDoc,
		},
	},
};
export type ViewDislikeComment = {
	commentId: ObjectId;
	dislikes: CommentReaction[];
};

//===========================================//

export const BodyCommentsCountSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			default: defaultSwaggerValues.ticketId,
			description: "ID билета",
		},
		questionId: {
			type: "string",
			default: defaultSwaggerValues.questionId,
			description: "ID вопроса",
		},
	},
};
export type BodyCommentsCount = {
	ticketId: string;
	questionId: string;
};

//===========================================//

export const ViewCommentsCountSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		count: {
			type: "number",
			default: "67dfedd2805cdebd10d86ff7",
			description: "Количество комментариев",
		},
	},
};
export type ViewCommentsCount = {
	count: number;
};

//===========================================//
