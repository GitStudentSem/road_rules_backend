export const settings = {
	MONGO_URI: process.env.mongoURI || "",
	JWT_SECRET: process.env.JWT_SECRET || "somthingStrangeString",
};

export const defaultSwaggerValues = {
	authToken:
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNzIwMjk4MzgyNTUyIiwiaWF0IjoxNzMwNjQ5ODE0LCJleHAiOjE3MzMyNDE4MTR9.KRbOuVsZbegGxnYjVmRc47o-pjz_JzpiqOK4ziESVgg",
	ticketId: "1722254296932",
	questionId: "1722674857532",
	answerId: "17226748575851",
	email: "your_email@yandex.ru",
	password: "123456",
};
