type Result = {
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
  // У супер администратора нельзя отобрать права администирования
  role: 'user' | 'admin' | 'superadmin'
	results: {
		/** key format: ticket-n где n - это число */
		[key: string]: Result[] | undefined;
		exam?: Result[];
	};
};
