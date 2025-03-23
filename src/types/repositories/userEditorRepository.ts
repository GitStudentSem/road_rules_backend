export type SetRole = { userId: string; email: string; role: "user" | "admin" };

export type AppointExam = { isAppoint: boolean; email: string; userId: string };

export type IsBannedForChat = {
	isBannedForChat: boolean;
	email: string;
	userId: string;
};

export type DeleteUser = { userId: string; email: string };

export type GetExamResult = { email: string; userId: string };
