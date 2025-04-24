export const settings = {
	MONGO_URI: process.env.mongoURI || "",
	JWT_SECRET: process.env.JWT_SECRET || "somthingStrangeString",
};

export const defaultSwaggerValues = {
	authToken:
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNzQyMDM3MDUyODAzIiwiaWF0IjoxNzQ1NTA3MDk1LCJleHAiOjE3NDgwOTkwOTV9.N9t7QONkP7qnue2dWox-jksVh5-4OOq8pdWnkCW189Y",
	ticketId: "1722254296932",
	questionId: "1722674857532",
	answerId: "17226748575851",
	email: "your_email@yandex.ru",
	password: "123456",
};
