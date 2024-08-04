export type CreateQuestion = {
	imgInfo: {
		img: string;
		imageOriginalHash: string;
		imagePrcessedHash: string;
	};
	questionId: string;
	ticketId: string;
	question: string;
	help: string;
	answers: {
		answerText: string;
		answerId: string;
		isCorrect: boolean;
	}[];
	userId: string;
};

export type CreateTicket = {
	ticketId: string;
	createdAt: number;
	userId: string;
};

export type FindQuestion = {
	ticketId: string;
	questionId: string;
	userId: string;
};

export type DeleteQuestion = {
	ticketId: string;
	questionId: string;
	userId: string;
};
