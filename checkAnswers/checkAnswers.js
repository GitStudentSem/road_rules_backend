const answersData = [
	[1, 1, 1, 1],
	[2, 2, 2, 2],
	[3, 3, 3, 3],
	[4, 4, 4, 4],
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
