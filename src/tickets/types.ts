export type TypeAnswers = {
	text: string;
	isCorrect: boolean;
};

export type TypeQuestion = {
	img: string;
	question: string;
	answers: TypeAnswers[];
	help: string;
};
