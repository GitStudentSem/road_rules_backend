export const sendError = ({
	status = 500,
	message = "Неизвестная ошибка",
	error,
	res,
}) => {
	console.log(message, error);
	return res.status(status).send({ message });
};
