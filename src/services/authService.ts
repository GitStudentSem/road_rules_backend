import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authRepository } from "../repositories/authRepository";
import { HTTP_STATUSES } from "../utils";
import { DBError } from "../controllers/DBError";
import { settings } from "../assets/settings";
import type { Login, Register } from "../types/services/authService";
import sharp from "sharp";
import { s3 } from "../app";
import { colors, resetStyle, styles } from "../assets/logStyles";

const calculateSizeInKB = (arrayBuffer: ArrayBuffer) => {
	const bytes = arrayBuffer.byteLength;
	const kilobytes = Math.round(bytes / 1024);
	return kilobytes;
};

const uploadAvatar = async (data: { userId: string; avatar: Buffer }) => {
	const bucketName = process.env.BUCKET_NAME_FOR_S3 || "";
	const key = `avatars/${data.userId}.jpg`;

	const params = {
		Bucket: bucketName,
		Key: key,
		Body: data.avatar,
	};

	const result = await s3.upload(params).promise();
	return result.Location;
};

const saveAvatar = async ({
	userId,
	avatar,
}: { userId: string; avatar: ArrayBuffer | null }) => {
	if (!avatar) return { avatar: "" };
	const imageSizeBefore = calculateSizeInKB(avatar);

	const processedAvatar = await sharp(avatar).jpeg().toBuffer();

	const filePath = await uploadAvatar({
		avatar: processedAvatar,
		userId,
	});

	const imageSizeAfter = calculateSizeInKB(processedAvatar);

	const reductionPercentage = (
		((imageSizeBefore - imageSizeAfter) / imageSizeBefore) *
		100
	).toFixed(2);

	console.log(
		`${colors.blue}Размер аватара до сжатия: ${styles.bold}${imageSizeBefore} KB ${resetStyle}`,
	);

	console.log(
		`${colors.blue}Размер аватара после сжатия: ${styles.bold}${imageSizeAfter} KB${resetStyle}`,
	);

	console.log(
		`${colors.blue}Аватар был оптимизирован на ${styles.bold}${reductionPercentage}%${resetStyle}`,
	);
	console.log(`${colors.blue}======================${resetStyle}`);

	return { avatar: filePath || "" };
};

export const authService = {
	async register(data: Register) {
		const { email, firstName, secondName, password, department } = data;
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(password, salt);

		const registerdUser = await authRepository.register({
			email,
			firstName,
			secondName,
			passwordHash,
			department,
		});

		const token: string = jwt.sign(
			{ userId: registerdUser.userId },
			settings.JWT_SECRET,
			{
				expiresIn: "30d",
			},
		);

		const userWithoutPasswordHash = {
			email: registerdUser.email,
			firstName: registerdUser.firstName,
			secondName: registerdUser.secondName,
			userId: registerdUser.userId,
			avatar: registerdUser.avatar,
			token,
		};

		return userWithoutPasswordHash;
	},

	async login(data: Login) {
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

		const { userId, firstName, secondName, avatar, isAppointExam } =
			loginnedUser;

		const token = jwt.sign({ userId }, settings.JWT_SECRET, {
			expiresIn: "30d",
		});

		return { firstName, secondName, token, isAppointExam, userId, avatar };
	},

	async adminLogin(data: Login) {
		const { email, password } = data;

		const loginnedUser = await authRepository.adminLogin({ email });

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

		const { userId, firstName, secondName, avatar, isAppointExam } =
			loginnedUser;

		const token = jwt.sign({ userId }, settings.JWT_SECRET, {
			expiresIn: "30d",
		});

		return { firstName, secondName, token, isAppointExam, userId, avatar };
	},

	async setAvatar(userId: string, avatar: ArrayBuffer | null) {
		const savedImageInfo = await saveAvatar({ userId, avatar });
		const savedAvatar = await authRepository.setAvatar(
			userId,
			savedImageInfo.avatar,
		);
		return savedAvatar;
	},
};
