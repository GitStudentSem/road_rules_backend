const answersData = [
	[2, 1, 1, 4, 2, 2, 4, 3, 1, 3, 1, 3, 3, 1, 3, 4, 3, 4, 3, 2],
	[2, 1, 1, 3, 3, 1, 3, 3, 1, 3, 3, 2, 3, 3, 1, 3, 2, 1, 3, 3],
	[1, 3, 3, 2, 2, 3, 2, 1, 3, 3, 3, 2, 2, 1, 3, 3, 4, 2, 3, 3],
];

export const checkTicketAnswers = (ticket, userAnswers) => {
	let errorsCount = 0;
	for (let i = 0; i < userAnswers.length; i++) {
		const userAnswer = userAnswers[i];
		const correctAnswer = answersData[ticket][i];

		if (userAnswer !== correctAnswer) errorsCount++;
	}

	return { result: errorsCount <= 2, correctAnswers: answersData[ticket] };
};

export const checkExam = (userAnswers) => {
	try {
		let errorsCount = 0;

		const correctAnswers = [];
		for (let i = 0; i < userAnswers.length; i++) {
			const { ticket, question, answer } = userAnswers[i];

			const correctAnswer = answersData[ticket - 1][question - 1];

			correctAnswers.push(correctAnswer);

			if (answer !== correctAnswer) errorsCount++;
		}

		return { result: errorsCount <= 2, correctAnswers };
	} catch (error) {
		console.log(error);
	}
};
