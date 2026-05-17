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
});
