export type QuestionWithTicketId = {
	imgInfo: {
		img: string;
		imageOriginalHash: string;
		imagePrcessedHash: string;
	};
	questionId: string;
	question: string;
	help: string;
	answers: {
		answerText: string;
		answerId: string;
		isCorrect: boolean;
	}[];
	ticketId: string;
};

export type SendExamAnswer = {
	userId: string;
	ticketId: string;
	questionId: string;
	answerId: string;
};

export type SetAlwaysCompleteExam = {
	email: string;
	isAlwaysComplete: boolean;
};
