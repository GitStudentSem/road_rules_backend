export const UserLoginViewModelSwaggerDoc = {
	type: "object",
	properties: {
		firstName: {
			type: "string",
			default: "Иван",
			description: "Имя",
		},
		secondName: {
			type: "string",
			default: "Иванов",
			description: "Фамилия",
		},
		isAppointExam: {
			type: "boolean",
			default: "false",
			description: "назначен ли экзамен пользователю",
		},
		token: {
			type: "string",
			default:
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3MTc0NDA3NDEzMDQiLCJpYXQiOjE3MTc0NDI1MjAsImV4cCI6MTcyMDAzNDUyMH0.imiX_CYuKDB1u58elXLfQfE8_oNpO8rvh3Uk2fkWEsU",
			description: "Токен авторизации",
		},
	},
};

export type UserLoginViewModel = {
	token: string;
	firstName: string;
	secondName: string;
	isAppointExam: boolean;
};
