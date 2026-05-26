import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
	{
		ignores: ["coverage/**"],
	},
	...nextVitals,
	...nextTypescript,
	{
		rules: {
			"@typescript-eslint/no-unused-vars": "warn",
		},
	}
];

export default eslintConfig;
