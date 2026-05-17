import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
	join(
		process.cwd(),
		"app",
		"sign-in",
		"[[...sign-in]]",
		"SignInCredentialsForm.tsx",
	),
	"utf8",
);

describe("SignInCredentialsForm", () => {
	it("asks for identifier and password in the same form step", () => {
		expect(source).toContain('className="auth-credentials-form"');
		expect(source).toContain('name="identifier"');
		expect(source).toContain('autoComplete="username"');
		expect(source).toContain('name="password"');
		expect(source).toContain('type="password"');
		expect(source).toContain('autoComplete="current-password"');
		expect(source).toContain("password,");
		expect(source).toContain("signIn.finalize()");
	});
});
