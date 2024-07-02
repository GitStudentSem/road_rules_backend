export const settings = {
	MONGO_URI: process.env.mongoURI || "",
	JWT_SECRET: process.env.JWT_SECRET || "somthingStrangeString",
};

export const defaultSwaggerValues = {
	authToken:
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNzE3NDQwNzQxMzA0IiwiaWF0IjoxNzE5OTI4NTg5LCJleHAiOjE3MjI1MjA1ODl9.cfQvyhlkU3Y2mBsnt4wufKML5ClydC4rnBP9tEWrHIw",
	ticketId: "1719675339512",
	questionId: "1719675555920",
	answerId: "17199090369010",
	email: "your_email@yandex.ru",
	password: "123456",
};
