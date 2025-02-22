export const settings = {
	MONGO_URI: process.env.mongoURI || "",
	JWT_SECRET: process.env.JWT_SECRET || "somthingStrangeString",
};

export const defaultSwaggerValues = {
	authToken:
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNzIwMjk4MzgyNTUyIiwiaWF0IjoxNzQwMjA3NDMxLCJleHAiOjE3NDI3OTk0MzF9.ODVyN1isPHydTmC_ViQQlAVSpuioWBgg2Ir3lz4vOHY",
	ticketId: "1722254296932",
	questionId: "1722674857532",
	answerId: "17226748575851",
	email: "your_email@yandex.ru",
	password: "123456",
};
