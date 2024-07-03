import { defaultSwaggerValues } from "../../assets/settings";

const ResultSwaggerDoc = {
	type: "object",
	properties: {
		isCorrect: {
			type: "boolean",
			default: "true",
			description: "Правильный ответ или нет",
		},
		answerId: {
			type: "string",
			default: defaultSwaggerValues.answerId,
			description: "id ответа который дал пользователь",
		},
	},
};
type Result = {
	isCorrect: boolean;
	ticketId: string;
	questionId: string;
	answerId: string;
};

export const GetAllUsersViewModelSwaggerDoc = {
	type: "object",
	properties: {
		email: {
			type: "string",
			default: defaultSwaggerValues.email,
			description: "Почта пользователя",
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
		role: {
			type: "string",
			default: "user",
			description: "Роль пользователя",
		},

		isAppointExam: {
			type: "boolean",
			default: "false",
			description: "Назначен ли экзамен для пользователя",
		},
		examResults: {
			type: "object",
			description: "Результаты экзамена пользователя",
			properties: {
				exam: {
					passAt: {
						type: "number",
						description: "Дата в мс когда был сдан экзамен",
					},
					result: {
						type: "array",
						description: "Массив результатов экзамена",
						items: ResultSwaggerDoc,
					},
				},
			},
		},
	},
};

export type GetAllUsersViewModel = {
	email: string;
	firstName: string;
	secondName: string;
	isAppointExam: boolean;
	role: "superadmin" | "admin" | "user";
	examResults?: { passAt: number; result: Result[] };
};
