export const UserRegisterViewModelSwaggerDoc = {
	type: "object",
	properties: {
		email: {
			type: "string",
			description: "Почта пользователя",
			default: "your_email@yandex.ru",
		},
		firstName: {
			type: "string",
			description: "Имя пользователя",
			default: "Иван",
		},
		secondName: {
			type: "string",
			description: "Фамилия пользователя",
			default: "Иванов",
		},
		id: {
			type: "string",
			description: "Пароль пользователя",
			default: "1717440741304",
		},
	},
};

export type UserRegisterViewModel = {
	email: string;
	firstName: string;
	secondName: string;
	id: string;
};
