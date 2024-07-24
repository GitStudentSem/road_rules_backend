import type { Answer } from "../../models/Answer";
import type { OpenAPIV3 } from "openapi-types";
import { defaultSwaggerValues } from "../../assets/settings";

export const ViewClearQuestionInfoSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		userResultInfo: {
			type: "object",
			description: "Информация об ответах пользователя",
			properties: {
				isCorrect: {
					type: "boolean",
					description: "Правильный ответ или нет",
					default: "true",
				},
				ticketId: {
					type: "string",
					default: defaultSwaggerValues.ticketId,
					description: "id билета",
				},
				questionId: {
					type: "string",
					description: "id вопроса который нужно удалить",
					default: defaultSwaggerValues.questionId,
				},
				answerId: {
					type: "string",
					description: "id варианта ответа",
					default: defaultSwaggerValues.answerId,
				},
			},
		},
		questionInfo: {
			type: "object",
			description: "Информация о вопросе экзамена",
			properties: {
				question: {
					type: "string",
					default: "В каком направлении разрешен поворот?",
					description: "Текст вопроса",
				},
				img: {
					type: "string",
					format: "binary",
					description: "Картинка в виде ArrayBuffer",
				},
				help: {
					type: "string",
					default: "В направлении движения по полосам",
					description: "Текст помощи по вопросу",
				},
				answers: {
					type: "array",
					description: "Варианты ответов на вопрос",
					items: {
						type: "string",
						default: "Только направо",
						description: "Текст варианта ответа на вопрос",
					},
				},
			},
		},
	},
};

export type ViewClearQuestionInfo = {
	userResultInfo: {
		isCorrect: boolean;
		ticketId: string;
		questionId: string;
		answerId: string;
	};

	questionInfo: {
		question: string;
		img: string;
		help: string;
		answers: Answer[];
	};
};
