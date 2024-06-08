export const BodyLoginModelSwaggerDoc = {
	type: "object",
	properties: {
		email: {
			type: "string",
			description: "Почта пользователя",
			default: "your_email@yandex.ru",
		},
		password: {
			type: "string",
			description: "Пароль пользователя",
			default: "123456",
		},
	},
	required: ["email", "password"],
};

export type BodyLoginModel = {
	email: string;
	password: string;
};
