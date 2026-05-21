import Image from "next/image";
import Link from "next/link";
import SignInCredentialsForm from "./SignInCredentialsForm";

const signInShellClassName =
	"relative isolate grid min-h-screen overflow-hidden bg-slate-950 text-white lg:grid-cols-[1.05fr_0.95fr]";
const backgroundGlowClassName =
	"pointer-events-none absolute -top-32 left-10 -z-10 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl";
const backgroundAccentClassName =
	"pointer-events-none absolute bottom-10 left-1/3 -z-10 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl";

const visualPanelClassName =
	"relative flex min-h-[42rem] flex-col justify-between gap-12 border-r border-white/10 p-6 sm:p-10 lg:min-h-screen lg:p-16";
const formPanelClassName =
	"relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-12";

const logoLinkClassName =
	"inline-flex w-fit rounded-2xl bg-white/95 p-3 shadow-2xl shadow-blue-950/20 ring-1 ring-white/20";
const logoImageClassName = "h-auto w-44";
const heroCopyClassName = "grid max-w-[36rem] gap-6";
const heroTitleClassName =
	"max-w-[12ch] text-5xl leading-[0.95] font-black tracking-[-0.06em] text-balance sm:text-6xl lg:text-7xl";
const mutedParagraphClassName = "max-w-xl text-lg leading-8 text-slate-300";
const formCardClassName = "flex w-[min(100%,30rem)] justify-center";

export default function SignInPage() {
	return (
		<main className={signInShellClassName}>
			<div className={backgroundGlowClassName} aria-hidden="true" />
			<div className={backgroundAccentClassName} aria-hidden="true" />

			<section className={visualPanelClassName} aria-labelledby="sign-in-title">
				<Link
					className={logoLinkClassName}
					href="/"
					aria-label="Page Home Pay home"
				>
					<Image
						className={logoImageClassName}
						src="/images/logo.png"
						alt="Page Home Pay"
						width={176}
						height={54}
						priority
					/>
				</Link>

				<div className={heroCopyClassName}>
					<h1 className={heroTitleClassName} id="sign-in-title">
						Ingresá a tu casa financiera.
					</h1>
					<p className={mutedParagraphClassName}>
						Autenticación segura con Clerk para proteger el panel de pagos y
						mantener la sesión lista para futuras integraciones de API.
					</p>
				</div>
			</section>

			<section className={formPanelClassName} aria-label="Sign in form">
				<div className={formCardClassName}>
					<SignInCredentialsForm />
				</div>
			</section>
		</main>
	);
}
