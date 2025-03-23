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
	},
};
export type ViewSendComment = {
	ticketId: string;
	questionId: string;
	commentId: string;
	text: string;
	firstName: string;
	secondName: string;
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
	},
};
export type ViewSendAllComments = {
	ticketId: string;
	questionId: string;
	commentId: string;
	text: string;
	firstName: string;
	secondName: string;
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
	},
};
export type ViewDeleteCommentSwaggerDoc = {
	ticketId: string;
	questionId: string;
	commentId: string;
	text: string;
	firstName: string;
	secondName: string;
};
