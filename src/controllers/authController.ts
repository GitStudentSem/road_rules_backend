import { sendError } from "../assets/requestAssets";
import type { Response } from "express";
import type { ErrorType, RequestWithBody } from "../types";
import { HTTP_STATUSES } from "../utils";
import { DBError } from "./DBError";
import { authService } from "../services/authService";
import type {
	BodyLogin,
	BodyRegister,
	BodySetAvatar,
	ViewLogin,
	ViewRegister,
	ViewSetAvatar,
} from "../types/controllers/authController";

export const authController = {
	async register(
		req: RequestWithBody<BodyRegister>,
		res: Response<ViewRegister | ErrorType>,
	) {
		try {
			const { email, firstName, secondName, password, autoSchoolName } =
				req.body;

			const registerdUser = await authService.register({
				email,
				firstName,
				secondName,
				password,
				autoSchoolName,
			});

			res.status(HTTP_STATUSES.OK_200).json(registerdUser);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({ message: "Не удалось зарегистрироваться", error, res, req });
		}
	},

	async login(
		req: RequestWithBody<BodyLogin>,
		res: Response<ViewLogin | ErrorType>,
	) {
		try {
			const { email, password } = req.body;

			const loginnedUser = await authService.login({ email, password });

			res.status(HTTP_STATUSES.OK_200).json(loginnedUser);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({ message: "Не удалось войти в систему", error, res, req });
		}
	},

	async adminLogin(
		req: RequestWithBody<BodyLogin>,
		res: Response<ViewLogin | ErrorType>,
	) {
		try {
			const { email, password } = req.body;

			const loginnedUser = await authService.adminLogin({ email, password });

			res.status(HTTP_STATUSES.OK_200).json(loginnedUser);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({ message: "Не удалось войти в систему", error, res, req });
		}
	},

	async setAvatar(
		req: RequestWithBody<BodySetAvatar>,
		res: Response<ViewSetAvatar | ErrorType>,
	) {
		try {
			const avatar = req.file?.buffer || null;

			const savedAvatar = await authService.setAvatar(req.userId || "", avatar);
			res.status(HTTP_STATUSES.OK_200).json({ avatar: savedAvatar });
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({ message: "Не удалось добавить аватар", error, res, req });
		}
	},
};
