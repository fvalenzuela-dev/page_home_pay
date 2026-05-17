import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
		const { default: SignInCredentialsForm } = await import(
			"./SignInCredentialsForm"
		);
		const html = renderToStaticMarkup(<SignInCredentialsForm />);

		expect(html).toContain("auth-credentials-form");
		expect(html).toContain('name="identifier"');
		expect(html).toContain('autoComplete="username"');
		expect(html).toContain('name="password"');
		expect(html).toContain('type="password"');
		expect(html).toContain('autoComplete="current-password"');
		expect(html).toContain("Ingresar");
	});

	it("disables submit while Clerk is unavailable", async () => {
		useSignInMock.mockReturnValue({
			fetchStatus: "idle",
			signIn: null,
		});
		const { default: SignInCredentialsForm } = await import(
			"./SignInCredentialsForm"
		);
		const html = renderToStaticMarkup(<SignInCredentialsForm />);

		expect(html).toContain('class="auth-submit-button"');
		expect(html).toContain("disabled");
	});

	it("maps Clerk and fallback errors safely", async () => {
		const { getErrorMessage } = await import("./SignInCredentialsForm");

		expect(
			getErrorMessage({ errors: [{ longMessage: "Credenciales inválidas" }] }),
		).toBe("Credenciales inválidas");
		expect(getErrorMessage({ errors: [{ message: "Error corto" }] })).toBe(
			"Error corto",
		);
		expect(getErrorMessage(null)).toBe(
			"No pudimos iniciar sesión. Revisá tus credenciales e intentá nuevamente.",
		);
		expect(getErrorMessage({ errors: "invalid" })).toBe(
			"No pudimos iniciar sesión. Revisá tus credenciales e intentá nuevamente.",
		);
	});

	it("skips submission when Clerk sign-in is unavailable", async () => {
		const { submitCredentials } = await import("./SignInCredentialsForm");
		const setErrorMessage = vi.fn();
		const setIsSubmitting = vi.fn();
		const onSuccess = vi.fn();

		await submitCredentials({
			signIn: null,
			identifier: "user@example.com",
			password: "secret",
			setErrorMessage,
			setIsSubmitting,
			onSuccess,
		});

		expect(setErrorMessage).not.toHaveBeenCalled();
		expect(setIsSubmitting).not.toHaveBeenCalled();
		expect(onSuccess).not.toHaveBeenCalled();
	});

	it("submits credentials and finalizes a complete Clerk session", async () => {
		const { submitCredentials } = await import("./SignInCredentialsForm");
		const signIn = {
			create: vi.fn().mockResolvedValue({ error: null }),
			finalize: vi.fn().mockResolvedValue({ error: null }),
			status: "complete",
		};
		const setErrorMessage = vi.fn();
		const setIsSubmitting = vi.fn();
		const onSuccess = vi.fn();

		await submitCredentials({
			signIn,
			identifier: "user@example.com",
			password: "secret",
			setErrorMessage,
			setIsSubmitting,
			onSuccess,
		});

		expect(signIn.create).toHaveBeenCalledWith({
			identifier: "user@example.com",
			password: "secret",
		});
		expect(signIn.finalize).toHaveBeenCalledOnce();
		expect(onSuccess).toHaveBeenCalledOnce();
		expect(setErrorMessage).toHaveBeenCalledWith(null);
		expect(setIsSubmitting).toHaveBeenNthCalledWith(1, true);
		expect(setIsSubmitting).toHaveBeenLastCalledWith(false);
	});

	it("shows Clerk errors from create, finalize, pending status, and thrown failures", async () => {
		const { submitCredentials } = await import("./SignInCredentialsForm");
		const setErrorMessage = vi.fn();
		const setIsSubmitting = vi.fn();
		const onSuccess = vi.fn();

		await submitCredentials({
			signIn: {
				create: vi.fn().mockResolvedValue({
					error: { errors: [{ message: "Create failed" }] },
				}),
				finalize: vi.fn(),
				status: "needs_identifier",
			},
			identifier: "user@example.com",
			password: "secret",
			setErrorMessage,
			setIsSubmitting,
			onSuccess,
		});
		expect(setErrorMessage).toHaveBeenCalledWith("Create failed");

		await submitCredentials({
			signIn: {
				create: vi.fn().mockResolvedValue({ error: null }),
				finalize: vi.fn().mockResolvedValue({
					error: { errors: [{ message: "Finalize failed" }] },
				}),
				status: "complete",
			},
			identifier: "user@example.com",
			password: "secret",
			setErrorMessage,
			setIsSubmitting,
			onSuccess,
		});
		expect(setErrorMessage).toHaveBeenCalledWith("Finalize failed");

		await submitCredentials({
			signIn: {
				create: vi.fn().mockResolvedValue({ error: null }),
				finalize: vi.fn(),
				status: "needs_second_factor",
			},
			identifier: "user@example.com",
			password: "secret",
			setErrorMessage,
			setIsSubmitting,
			onSuccess,
		});
		expect(setErrorMessage).toHaveBeenCalledWith(
			"Tu cuenta requiere un paso adicional de verificación. Usá el flujo de Clerk configurado para completar el inicio de sesión.",
		);

		await submitCredentials({
			signIn: {
				create: vi.fn().mockRejectedValue({
					errors: [{ message: "Network failed" }],
				}),
				finalize: vi.fn(),
				status: "needs_identifier",
			},
			identifier: "user@example.com",
			password: "secret",
			setErrorMessage,
			setIsSubmitting,
			onSuccess,
		});
		expect(setErrorMessage).toHaveBeenCalledWith("Network failed");
	});
});
