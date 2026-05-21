import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const TEST_IDENTIFIER = "user@example.com";
const TEST_CREDENTIAL = ["test", "credential"].join("-");
const EXTRA_VERIFICATION_MESSAGE =
	"Tu cuenta requiere un paso adicional de verificación. Usá el flujo de Clerk configurado para completar el inicio de sesión.";
const DEFAULT_ERROR_MESSAGE =
	"No pudimos iniciar sesión. Revisá tus credenciales e intentá nuevamente.";

const pushMock = vi.fn();
const useSignInMock = vi.fn();

vi.mock("@clerk/nextjs", () => ({
	useSignIn: () => useSignInMock(),
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: pushMock,
	}),
}));

async function loadSignInCredentialsForm() {
	return import("./SignInCredentialsForm");
}

async function renderFormMarkup() {
	const { default: SignInCredentialsForm } = await loadSignInCredentialsForm();
	return renderToStaticMarkup(<SignInCredentialsForm />);
}

function requireMarkup(markup: string, expectedContent: string) {
	if (!markup.includes(expectedContent)) {
		throw new Error(`Expected rendered form to include ${expectedContent}`);
	}
}

function countSubmitButtons(markup: string) {
	return [...markup.matchAll(/<button\b[^>]*type="submit"/g)].length;
}

function makeSubmitOptions() {
	return {
		identifier: TEST_IDENTIFIER,
		password: TEST_CREDENTIAL,
		setErrorMessage: vi.fn(),
		setIsSubmitting: vi.fn(),
		onSuccess: vi.fn(),
	};
}

describe("SignInCredentialsForm", () => {
	beforeEach(() => {
		pushMock.mockReset();
		useSignInMock.mockReturnValue({
			fetchStatus: "idle",
			signIn: {
				create: vi.fn(),
				finalize: vi.fn(),
				status: "needs_identifier",
			},
		});
	});

	it("renders identifier and password inputs in the same form step", async () => {
		const markup = await renderFormMarkup();

		requireMarkup(markup, "grid w-full");
		requireMarkup(markup, 'name="identifier"');
		requireMarkup(markup, 'autoComplete="username"');
		requireMarkup(markup, 'name="password"');
		requireMarkup(markup, 'type="password"');
		requireMarkup(markup, 'autoComplete="current-password"');
		requireMarkup(markup, "Ingresar");
		expect(countSubmitButtons(markup)).toBe(1);
	});

	it("disables submit while Clerk is unavailable", async () => {
		useSignInMock.mockReturnValue({
			fetchStatus: "idle",
			signIn: null,
		});
		const markup = await renderFormMarkup();

		requireMarkup(markup, "bg-primary");
		requireMarkup(markup, "disabled:pointer-events-none");
		requireMarkup(markup, "disabled");
	});

	it("maps Clerk and fallback errors safely", async () => {
		const { getErrorMessage } = await loadSignInCredentialsForm();

		expect(
			getErrorMessage({ errors: [{ longMessage: "Credenciales inválidas" }] }),
		).toBe("Credenciales inválidas");
		expect(getErrorMessage({ errors: [{ message: "Error corto" }] })).toBe(
			"Error corto",
		);
		expect(getErrorMessage(null)).toBe(DEFAULT_ERROR_MESSAGE);
		expect(getErrorMessage({ errors: "invalid" })).toBe(DEFAULT_ERROR_MESSAGE);
		expect(getErrorMessage({ errors: [{ message: "" }] })).toBe(
			DEFAULT_ERROR_MESSAGE,
		);
	});

	it("updates controlled input state from field change events", async () => {
		const { createInputChangeHandler } = await loadSignInCredentialsForm();
		const setValue = vi.fn();

		createInputChangeHandler(setValue)({ target: { value: TEST_IDENTIFIER } });

		expect(setValue).toHaveBeenCalledWith(TEST_IDENTIFIER);
	});

	it("prevents the native form submission before submitting credentials", async () => {
		const { createSubmitHandler } = await loadSignInCredentialsForm();
		const options = makeSubmitOptions();
		const preventDefault = vi.fn();

		createSubmitHandler({ signIn: null, ...options })({ preventDefault });
		await Promise.resolve();

		expect(preventDefault).toHaveBeenCalledOnce();
		expect(options.setErrorMessage).not.toHaveBeenCalled();
	});

	it("skips submission when Clerk sign-in is unavailable", async () => {
		const { submitCredentials } = await loadSignInCredentialsForm();
		const options = makeSubmitOptions();

		await submitCredentials({
			signIn: null,
			...options,
		});

		expect(options.setErrorMessage).not.toHaveBeenCalled();
		expect(options.setIsSubmitting).not.toHaveBeenCalled();
		expect(options.onSuccess).not.toHaveBeenCalled();
	});

	it("submits credentials and finalizes a complete Clerk session", async () => {
		const { submitCredentials } = await loadSignInCredentialsForm();
		const signIn = {
			create: vi.fn().mockResolvedValue({ error: null }),
			finalize: vi.fn().mockResolvedValue({ error: null }),
			status: "complete",
		};
		const options = makeSubmitOptions();

		await submitCredentials({
			signIn,
			...options,
		});

		expect(signIn.create).toHaveBeenCalledWith({
			identifier: TEST_IDENTIFIER,
			password: TEST_CREDENTIAL,
		});
		expect(signIn.finalize).toHaveBeenCalledOnce();
		expect(options.onSuccess).toHaveBeenCalledOnce();
		expect(options.setErrorMessage).toHaveBeenCalledWith(null);
		expect(options.setIsSubmitting).toHaveBeenNthCalledWith(1, true);
		expect(options.setIsSubmitting).toHaveBeenLastCalledWith(false);
	});

	it("shows Clerk errors returned while creating a session", async () => {
		const { submitCredentials } = await loadSignInCredentialsForm();
		const options = makeSubmitOptions();

		await submitCredentials({
			signIn: {
				create: vi.fn().mockResolvedValue({
					error: { errors: [{ message: "Create failed" }] },
				}),
				finalize: vi.fn(),
				status: "needs_identifier",
			},
			...options,
		});

		expect(options.setErrorMessage).toHaveBeenCalledWith("Create failed");
	});

	it("shows Clerk errors returned while finalizing a complete session", async () => {
		const { submitCredentials } = await loadSignInCredentialsForm();
		const options = makeSubmitOptions();

		await submitCredentials({
			signIn: {
				create: vi.fn().mockResolvedValue({ error: null }),
				finalize: vi.fn().mockResolvedValue({
					error: { errors: [{ message: "Finalize failed" }] },
				}),
				status: "complete",
			},
			...options,
		});

		expect(options.setErrorMessage).toHaveBeenCalledWith("Finalize failed");
	});

	it("shows an extra-verification message for pending Clerk statuses", async () => {
		const { submitCredentials } = await loadSignInCredentialsForm();
		const options = makeSubmitOptions();

		await submitCredentials({
			signIn: {
				create: vi.fn().mockResolvedValue({ error: null }),
				finalize: vi.fn(),
				status: "needs_second_factor",
			},
			...options,
		});

		expect(options.setErrorMessage).toHaveBeenCalledWith(
			EXTRA_VERIFICATION_MESSAGE,
		);
	});

	it("shows Clerk errors thrown during submission", async () => {
		const { submitCredentials } = await loadSignInCredentialsForm();
		const options = makeSubmitOptions();

		await submitCredentials({
			signIn: {
				create: vi.fn().mockRejectedValue({
					errors: [{ message: "Network failed" }],
				}),
				finalize: vi.fn(),
				status: "needs_identifier",
			},
			...options,
		});

		expect(options.setErrorMessage).toHaveBeenCalledWith("Network failed");
	});
});
