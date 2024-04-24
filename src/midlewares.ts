import { validationResult } from "express-validator";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "./assets/requestAssets";

export const checkAuth = (req: Request, res: Response, next: any) => {
	const token: string = (req.headers.authorization || "").replace(
		/Bearer\s?/,
		"",
	);

	if (token) {
		try {
			const decoded = jwt.verify(token, "somthingStrangeString");

			//@ts-ignore
			req.userId = decoded._id;
			next();
		} catch (error) {
			sendError({
				status: 403,
				message: "Токен доступа неверен или истек",
				error,
				res,
			});
		}
	} else {
		return res.status(403).json({ message: "Токен доступа не был получен" });
	}
};

export const handleValudationErrors = (
	req: Request,
	res: Response,
	next: any,
) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const message = errors.array()[0].msg;
		return res.status(400).json({ message });
	}

	next();
};
