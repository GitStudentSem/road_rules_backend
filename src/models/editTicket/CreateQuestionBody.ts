export type CreateQuestionBody = {
	img?: ArrayBuffer;
	ticketId: string;
	question: string;
	help: string;
	answers: string[];
};
