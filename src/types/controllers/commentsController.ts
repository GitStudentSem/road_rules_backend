import type { ObjectId } from "mongodb";
import { defaultSwaggerValues } from "../../assets/settings";
import type { OpenAPIV3 } from "openapi-types";

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
			description: "Массив userId которые лайкнули комментарий",
			items: {
				type: "string",
				default: "1717440741304",
				description: "userId пользователя который лайкнул комментарий",
			},
		},
		dislikes: {
			type: "array",
			description: "Массив userId которые дизлайкнули комментарий",
			items: {
				type: "string",
				default: "1717440741304",
				description: "userId пользователя который дизлайкнул комментарий",
			},
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
	likes: string[];
	dislikes: string[];
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
			description: "Массив userId которые лайкнули комментарий",
			items: {
				type: "string",
				default: "1717440741304",
				description: "userId пользователя который лайкнул комментарий",
			},
		},
		dislikes: {
			type: "array",
			description: "Массив userId которые дизлайкнули комментарий",
			items: {
				type: "string",
				default: "1717440741304",
				description: "userId пользователя который дизлайкнул комментарий",
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
	likes: string[];
	dislikes: string[];
};

//===========================================//
export const BodyDeleteCommentSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		commentId: {
			type: "string",
			default: "67dfedd2805cdebd10d86ff7",
			description: "ID комментария",
		},
	},
	required: ["commentId"],
};
export type BodyDeleteComment = {
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
			description: "Массив userId которые лайкнули комментарий",
			items: {
				type: "string",
				default: "1717440741304",
				description: "userId пользователя который лайкнул комментарий",
			},
		},
		dislikes: {
			type: "array",
			description: "Массив userId которые дизлайкнули комментарий",
			items: {
				type: "string",
				default: "1717440741304",
				description: "userId пользователя который дизлайкнул комментарий",
			},
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
	likes: string[];
	dislikes: string[];
};
