import Link from "next/link";
import SignInCredentialsForm from "./SignInCredentialsForm";

export default function SignInPage() {
	return (
		<main className="auth-shell">
			<section className="auth-visual-panel" aria-labelledby="sign-in-title">
				<Link className="auth-brand" href="/" aria-label="Page Home Pay home">
					<span className="brand-icon" aria-hidden="true">
						P
					</span>
					<span>Page Home Pay</span>
				</Link>

				<div className="auth-copy">
					<p className="eyebrow">Serene Ledger</p>
					<h1 id="sign-in-title">Ingresá a tu casa financiera.</h1>
					<p>
						Autenticación segura con Clerk para proteger el panel de pagos y
						mantener la sesión lista para futuras integraciones de API.
					</p>
				</div>

				<div className="auth-preview-card" aria-hidden="true">
					<span className="status-chip paid">Protected</span>
					<strong>Sesión familiar</strong>
					<p>
						Token disponible mediante helpers de Clerk cuando se integren
						endpoints.
					</p>
				</div>
			</section>

			<section className="auth-form-panel" aria-label="Sign in form">
				<div className="auth-form-card">
					<SignInCredentialsForm />
				</div>
			</section>
		</main>
	);
}
