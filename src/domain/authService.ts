import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authRepository } from "../repositories/authRepository";
import type { BodyRegisterModel } from "../modeles/auth/BodyRegisterModel";
import { HTTP_STATUSES } from "../utils";
import { DBError } from "../controllers/DBError";
import { settings } from "../assets/settings";

export const authService = {
	async register(data: BodyRegisterModel) {
		const { email, firstName, secondName, password } = data;
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(password, salt);

		const registerdUser = await authRepository.register({
			email,
			firstName,
			secondName,
			passwordHash,
		});

		jwt.sign({ _id: registerdUser._id }, settings.JWT_SECRET, {
			expiresIn: "30d",
		});

		const userWithoutPasswordHash = {
			email: registerdUser.email,
			firstName: registerdUser.firstName,
			secondName: registerdUser.secondName,
			_id: registerdUser._id,
		};

		return userWithoutPasswordHash;
	},

	async login(data: { email: string; password: string }) {
		const { email, password } = data;

		const loginnedUser = await authRepository.login({ email });

		const isValidPass = await bcrypt.compare(
			password,
			loginnedUser.passwordHash,
		);

		if (!isValidPass) {
			throw new DBError(
				"Логин или пароль не верен",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}

		const { _id, firstName, secondName } = loginnedUser;

		const token = jwt.sign({ _id }, settings.JWT_SECRET, {
			expiresIn: "30d",
		});

		return { firstName, secondName, token };
	},
};
