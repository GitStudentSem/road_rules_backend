interface IResult {
	ticketId: string;
	questionId: string;
	answerId: string;
	isCorrect: boolean;
}

interface IuserInfo {
	email: string;
	firstName: string;
	secondName: string;
	passwordHash: string;
	userId: string;
	isAppointExam: boolean;
	role: string;
	autoSchoolName: string;
	results: {
		ticket_1729520262142: {
			passAt: number;
			result: IResult[];
		};
		ticket_1729520262143: {
			passAt: number;
			result: IResult[];
		};
		ticket_1729520262148: {
			passAt: number;
			result: IResult[];
		};
	};
}

interface IAnswers {
	answerText: string;
	isCorrect: boolean;
	answerId: string;
}

interface IQuestion {
	imgInfo: {
		img: string;
		imageOriginalHash: string;
		imageProcessedHash: string;
	};
	questionId: string;
	question: string;
	help: string;
	answers: IAnswers[];
}

interface ITicket {
	ticketId: string;
	questions: IQuestion[];
}
