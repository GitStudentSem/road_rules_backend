export const settings = {
	MONGO_URI: process.env.mongoURI || "",
	JWT_SECRET: process.env.JWT_SECRET || "somthingStrangeString",
};

export const defaultSwaggerValues = {
	authToken:
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNzQyMDM3MDUyODAzIiwiaWF0IjoxNzQyNzQwODA3LCJleHAiOjE3NDUzMzI4MDd9.m1bQX0skKRJevISXZWFLMzC3S1L27tiC-Uqk7chMdx4",
	ticketId: "1722254296932",
	questionId: "1722674857532",
	answerId: "17226748575851",
	email: "your_email@yandex.ru",
	password: "123456",
};
