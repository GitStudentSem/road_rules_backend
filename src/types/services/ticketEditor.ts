export type UploadFile = {
	img: Buffer;
	ticketId: string;
	questionId: string;
};

export type ListParams = {
	Bucket: string;
	Prefix: string;
	Objects?: { Key: string }[];
};

export type SaveImage = {
	img?: ArrayBuffer;
	ticketId: string;
	questionId: string;
	imageInDB?: string;
	DBImageOriginalHash?: string;
};

export type CreateQuestion = {
	userId: string;
	img?: ArrayBuffer;
	ticketId: string;
	question: string;
	help: string;
	correctAnswer: number;
	answers: string[];
};

export type EditQuestion = {
	img?: ArrayBuffer;
	ticketId: string;
	questionId: string;
	question: string;
	correctAnswer: number;
	answers: string[];
	userId: string;
	help: string;
};

export type DeleteQuestion = {
	ticketId: string;
	questionId: string;
	userId: string;
};
