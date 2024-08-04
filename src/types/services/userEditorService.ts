export type ExamResult = {
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
		answers: {
			answerText: string;
			answerId: string;
			isCorrect: boolean;
		}[];
	};
};

export type Result = {
	isCorrect: boolean;
	ticketId: string;
	questionId: string;
	answerId: string;
};

export type SetRole = {
	userId: string;
	email: string;
	role: "user" | "admin";
};

export type AppointExam = { isAppoint: boolean; email: string; userId: string };

export type DeleteUser = { userId: string; email: string };

export type GetExamResult = { email: string; userId: string };
