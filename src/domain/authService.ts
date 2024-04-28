import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authRepository } from "../repositories/authRepository";
import { BodyRegisterModel } from "../modeles/auth/BodyRegisterModel";

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

		jwt.sign({ _id: registerdUser._id }, "somthingStrangeString", {
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
};
