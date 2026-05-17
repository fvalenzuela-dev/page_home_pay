"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

function getErrorMessage(error: unknown): string {
	if (
		typeof error === "object" &&
		error !== null &&
		"errors" in error &&
		Array.isArray(error.errors) &&
		error.errors.length > 0
	) {
		const firstError = error.errors[0] as {
			longMessage?: string;
			message?: string;
		};
		return (
			firstError.longMessage ??
			firstError.message ??
			"No pudimos iniciar sesión."
		);
	}

	return "No pudimos iniciar sesión. Revisá tus credenciales e intentá nuevamente.";
}

export default function SignInCredentialsForm() {
	const { fetchStatus, signIn } = useSignIn();
	const router = useRouter();
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!signIn) {
			return;
		}

		setErrorMessage(null);
		setIsSubmitting(true);

		try {
			const createResult = await signIn.create({
				identifier,
				password,
			});

			if (createResult.error) {
				setErrorMessage(getErrorMessage(createResult.error));
				return;
			}

			if (signIn.status === "complete") {
				const finalizeResult = await signIn.finalize();
				if (finalizeResult.error) {
					setErrorMessage(getErrorMessage(finalizeResult.error));
					return;
				}

				router.push("/");
				return;
			}

			setErrorMessage(
				"Tu cuenta requiere un paso adicional de verificación. Usá el flujo de Clerk configurado para completar el inicio de sesión.",
			);
		} catch (error) {
			setErrorMessage(getErrorMessage(error));
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<form className="auth-credentials-form" onSubmit={handleSubmit}>
			<div className="auth-form-heading">
				<p className="eyebrow">Acceso protegido</p>
				<h2>Iniciá sesión</h2>
				<p>Ingresá usuario o email y contraseña en un solo paso.</p>
			</div>

			<label className="auth-field" htmlFor="identifier">
				<span>Usuario o email</span>
				<input
					id="identifier"
					name="identifier"
					type="text"
					autoComplete="username"
					required
					value={identifier}
					onChange={(event) => setIdentifier(event.target.value)}
				/>
			</label>

			<label className="auth-field" htmlFor="password">
				<span>Contraseña</span>
				<input
					id="password"
					name="password"
					type="password"
					autoComplete="current-password"
					required
					value={password}
					onChange={(event) => setPassword(event.target.value)}
				/>
			</label>

			{errorMessage ? (
				<p className="auth-error-message" role="alert">
					{errorMessage}
				</p>
			) : null}

			<button
				className="auth-submit-button"
				type="submit"
				disabled={!signIn || fetchStatus === "fetching" || isSubmitting}
			>
				{isSubmitting ? "Ingresando…" : "Ingresar"}
			</button>
		</form>
	);
}
