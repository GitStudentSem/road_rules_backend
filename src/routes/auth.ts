import express from "express";
import {
	isEmailValid,
	loginValidation,
	registerValidation,
} from "../validations";
import { handleValudationErrors } from "../midlewares";
import * as userController from "../controllers/userController";

export const getAuthRouter = () => {
	const router = express.Router();

	router.post(
		"/register",
		registerValidation,
		handleValudationErrors,
		userController.register,
	);
	router.post(
		"/login",
		loginValidation,
		handleValudationErrors,
		userController.login,
	);
	router.post(
		"/delete",
		isEmailValid,
		handleValudationErrors,
		userController.deleteUser,
	);
	router.get("/getAllUsers", userController.getAllUsers);
	// router.get("/me", checkAuth, userController.getMe);

	return router;
};
