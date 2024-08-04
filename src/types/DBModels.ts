import { defaultSwaggerValues } from "../assets/settings";

export type Result = {
	isCorrect: boolean;
	ticketId: string;
	questionId: string;
	answerId: string;
};

export type UserLoginDBModel = {
	email: string;
	firstName: string;
	secondName: string;
	passwordHash: string;
	userId: string;
	isAppointExam: boolean;
	isAlwaysCompleteExam?: boolean;
	// У супер администратора нельзя отобрать права администирования
	role: "user" | "admin" | "superadmin";
	department: string;
	results: {
		/** key format: ticket-n где n - это число */
		[key: string]: { passAt: number; result: Result[] } | undefined;
		exam?: { passAt: number; result: Result[] };
		training_exam?: { passAt: number; result: Result[] };
	};
};

export type CreateQuestionDBModel = {
	imgInfo: {
		img: string;
		imageOriginalHash: string;
		imagePrcessedHash: string;
	};
	questionId: string;
	question: string;
	help: string;
	answers: Answer[];
};

export type TicketsDBModel = {
	ticketId: string;
	createdAt: number;
	questions: CreateQuestionDBModel[];
};

export const AnswerSwaggerDoc = {
	type: "object",
	properties: {
		answerText: {
			type: "string",
			description: "Текст варианта ответа",
			default: "Только направо",
		},
		answerId: {
			type: "string",
			description: "id варианта ответа",
			default: defaultSwaggerValues.answerId,
		},
		isCorrect: {
			type: "boolean",
			description: "правильный ли ответ",
			default: "true",
		},
	},
};
export type Answer = {
	answerText: string;
	answerId: string;
	isCorrect: boolean;
};
