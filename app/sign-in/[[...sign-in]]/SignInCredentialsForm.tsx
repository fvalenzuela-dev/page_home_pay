"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, type Dispatch, type SetStateAction } from "react";

const DEFAULT_SIGN_IN_ERROR =
	"No pudimos iniciar sesión. Revisá tus credenciales e intentá nuevamente.";

interface ClerkErrorDetail {
	longMessage?: string | null;
	message?: string | null;
}

interface ClerkErrorLike {
	errors?: ClerkErrorDetail[];
}

interface SignInCredentials {
	identifier: string;
	password: string;
}

interface SignInResult {
	error: unknown;
}

type SubmitErrorHandler = Dispatch<SetStateAction<string | null>>;
type SubmitStateHandler = Dispatch<SetStateAction<boolean>>;
type InputValueHandler = Dispatch<SetStateAction<string>>;

interface FormSubmitEvent {
	preventDefault: () => void;
}

interface InputChangeEvent {
	target: {
		value: string;
	};
}

interface SignInAttempt {
	create(credentials: SignInCredentials): Promise<SignInResult>;
	finalize(): Promise<SignInResult>;
	status: string;
}

interface SubmitCredentialsOptions extends SignInCredentials {
	signIn: SignInAttempt | null;
	setErrorMessage: SubmitErrorHandler;
	setIsSubmitting: SubmitStateHandler;
	onSuccess: () => void;
}

type SubmitHandlerOptions = SubmitCredentialsOptions;

function getClerkErrors(error: unknown): NonNullable<ClerkErrorLike["errors"]> {
	if (typeof error !== "object" || error === null) {
		return [];
	}

	const { errors } = error as ClerkErrorLike;
	return Array.isArray(errors) ? errors : [];
}

export function getErrorMessage(error: unknown): string {
	const firstError = getClerkErrors(error).at(0);
	if (firstError === undefined) {
		return DEFAULT_SIGN_IN_ERROR;
	}

	const errorMessage = firstError.longMessage ?? firstError.message;
	return errorMessage === ""
		? DEFAULT_SIGN_IN_ERROR
		: (errorMessage ?? DEFAULT_SIGN_IN_ERROR);
}

export function createInputChangeHandler(setValue: InputValueHandler) {
	return (event: InputChangeEvent) => {
		setValue(event.target.value);
	};
}

export function createSubmitHandler(options: SubmitHandlerOptions) {
	return (event: FormSubmitEvent) => {
		event.preventDefault();
		void submitCredentials(options);
	};
}

export async function submitCredentials({
	signIn,
	identifier,
	password,
	setErrorMessage,
	setIsSubmitting,
	onSuccess,
}: SubmitCredentialsOptions) {
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

			onSuccess();
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

export default function SignInCredentialsForm() {
	const { fetchStatus, signIn } = useSignIn();
	const router = useRouter();
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = createSubmitHandler({
		signIn,
		identifier,
		password,
		setErrorMessage,
		setIsSubmitting,
		onSuccess: () => {
			router.push("/");
		},
	});

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
					onChange={createInputChangeHandler(setIdentifier)}
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
					onChange={createInputChangeHandler(setPassword)}
				/>
			</label>

			{errorMessage !== null && (
				<p className="auth-error-message" role="alert">
					{errorMessage}
				</p>
			)}

			<button
				className="auth-submit-button"
				type="submit"
				disabled={signIn === null || fetchStatus === "fetching" || isSubmitting}
			>
				{isSubmitting ? "Ingresando…" : "Ingresar"}
			</button>
		</form>
	);
}
