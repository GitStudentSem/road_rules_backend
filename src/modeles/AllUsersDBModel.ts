import { UserLoginDBModel } from "./auth/UserLoginDBModel";

export type AllUsersDBModel = {
	[key: string]: UserLoginDBModel;
};