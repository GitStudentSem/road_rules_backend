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
			default: "17178414023020",
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
			default: "your_email@yandex.ru",
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
		isAppointExam: {
			type: "boolean",
			default: "false",
			description: "Назначен ли экзамен для пользователя",
		},
		results: {
			type: "object",
			description: "Результаты билетов и экзамена пользователя",
			properties: {
				exam: {
					type: "array",
					description: "Массив результатов экзамена",
					items: ResultSwaggerDoc,
				},
				ticket_1: {
					type: "array",
					description: "Массив результатов билета 1",
					items: ResultSwaggerDoc,
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
	results: {
		/** key format: ticket-n где n - это число */
		[key: string]: Result[] | undefined;
		exam?: Result[];
	};
};
