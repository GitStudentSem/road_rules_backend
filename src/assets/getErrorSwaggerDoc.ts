export const getErrorWaggerDoc = (description: string) => {
	return {
		description,
		content: {
			"application/json": {
				schema: {
					$ref: "#/components/schemas/ErrorType",
				},
			},
		},
	};
};
