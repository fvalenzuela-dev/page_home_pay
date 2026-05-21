"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, type Dispatch, type SetStateAction } from "react";
import Button from "../../components/ui/Button";

const DEFAULT_SIGN_IN_ERROR =
	"No pudimos iniciar sesión. Revisá tus credenciales e intentá nuevamente.";

const formCardClassName =
	"grid w-full gap-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/10 sm:p-8";
const headingGroupClassName = "grid gap-3";
const formTitleClassName =
	"text-3xl leading-tight font-black tracking-[-0.04em] text-slate-950 sm:text-4xl";
const mutedTextClassName = "leading-7 text-slate-500";
const fieldClassName = "grid gap-2 text-sm font-bold text-slate-800";
const inputClassName =
	"min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_4px_rgb(37_99_235_/_12%)]";
const errorMessageClassName =
	"rounded-2xl bg-red-50 px-4 py-3 leading-6 text-red-700 ring-1 ring-red-100";

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

type ClerkSignIn = NonNullable<ReturnType<typeof useSignIn>["signIn"]>;

interface SignInAttempt {
	create: ClerkSignIn["create"];
	finalize: ClerkSignIn["finalize"];
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
		<form className={formCardClassName} onSubmit={handleSubmit}>
			<div className={headingGroupClassName}>
				<h2 className={formTitleClassName}>Iniciá sesión</h2>
				<p className={mutedTextClassName}>Ingresá usuario y contraseña.</p>
			</div>

			<label className={fieldClassName} htmlFor="identifier">
				<span>Usuario o email</span>
				<input
					className={inputClassName}
					id="identifier"
					name="identifier"
					type="text"
					autoComplete="username"
					required
					value={identifier}
					onChange={createInputChangeHandler(setIdentifier)}
				/>
			</label>

			<label className={fieldClassName} htmlFor="password">
				<span>Contraseña</span>
				<input
					className={inputClassName}
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
				<p className={errorMessageClassName} role="alert">
					{errorMessage}
				</p>
			)}

			<Button
				variant="primary"
				type="submit"
				size="lg"
				disabled={signIn === null || fetchStatus === "fetching" || isSubmitting}
			>
				{isSubmitting ? "Ingresando…" : "Ingresar"}
			</Button>
		</form>
	);
}
