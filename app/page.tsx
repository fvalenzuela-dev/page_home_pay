import AppHeader from "./components/layout/AppHeader";
import HomeDashboard from "./HomeDashboard";

const homeShellClassName =
	"min-h-screen bg-[radial-gradient(circle_at_top_left,rgb(37_99_235_/_18%),transparent_28rem),linear-gradient(135deg,var(--surface),var(--surface-container-low))] p-4 text-[var(--on-surface)] transition-[background,color] duration-150 [--error-container:#ffdad6] [--error:#ba1a1a] [--on-primary:#ffffff] [--on-surface-variant:#434655] [--on-surface:#0b1c30] [--outline-variant:#c3c6d7] [--outline:#737686] [--primary-container:#2563eb] [--primary:#004ac6] [--secondary-container:#6cf8bb] [--secondary:#006c49] [--shadow:rgb(11_28_48_/_10%)] [--surface-container-high:#dce9ff] [--surface-container-low:#eff4ff] [--surface-container-lowest:#ffffff] [--surface-container:#e5eeff] [--surface-dim:#cbdbf5] [--surface:#f8f9ff] [color-scheme:light] has-[#theme-switch:checked]:[--error-container:#93000a] has-[#theme-switch:checked]:[--error:#ffb4ab] has-[#theme-switch:checked]:[--on-primary:#00174b] has-[#theme-switch:checked]:[--on-surface-variant:#c3c6d7] has-[#theme-switch:checked]:[--on-surface:#eaf1ff] has-[#theme-switch:checked]:[--outline-variant:#43556d] has-[#theme-switch:checked]:[--outline:#9ca3b4] has-[#theme-switch:checked]:[--primary-container:#2563eb] has-[#theme-switch:checked]:[--primary:#b4c5ff] has-[#theme-switch:checked]:[--secondary-container:#005236] has-[#theme-switch:checked]:[--secondary:#6ffbbe] has-[#theme-switch:checked]:[--shadow:rgb(0_0_0_/_28%)] has-[#theme-switch:checked]:[--surface-container-high:#2b3d55] has-[#theme-switch:checked]:[--surface-container-low:#182b44] has-[#theme-switch:checked]:[--surface-container-lowest:#13243a] has-[#theme-switch:checked]:[--surface-container:#213145] has-[#theme-switch:checked]:[--surface-dim:#213145] has-[#theme-switch:checked]:[--surface:#0b1c30] has-[#theme-switch:checked]:[color-scheme:dark] max-[560px]:p-3";

const heroSectionClassName =
	"mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)] gap-6 pt-20 pb-8 max-[880px]:grid-cols-1 max-[880px]:pt-8";

const heroCardClassName =
	"rounded-3xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-[clamp(2rem,5vw,4rem)]";

const eyebrowClassName =
	"m-0 text-xs leading-4 font-semibold tracking-[0.08em] text-[var(--on-surface-variant)] uppercase";

const heroTitleClassName =
	"mt-3 max-w-[14ch] font-['Manrope',Inter,ui-sans-serif,system-ui,sans-serif] text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em]";

const heroDescriptionClassName =
	"mt-6 max-w-[42rem] text-lg leading-[1.55] text-[var(--on-surface-variant)]";

const summaryCardClassName =
	"flex flex-col justify-between gap-8 self-stretch rounded-3xl border border-[var(--outline-variant)] bg-[linear-gradient(160deg,var(--primary-container),var(--primary))] p-6 text-[var(--on-primary)] shadow-[0_12px_32px_var(--shadow)]";

const summaryLabelClassName =
	"m-0 text-xs leading-4 font-semibold tracking-[0.08em] text-[color-mix(in_srgb,var(--on-primary)_78%,transparent)] uppercase";

const summaryTotalClassName =
	"mt-3 text-[clamp(2rem,5vw,3.5rem)] leading-none font-bold tracking-[-0.04em] tabular-nums";

const summaryNoteClassName =
	"text-[color-mix(in_srgb,var(--on-primary)_78%,transparent)]";

export default function HomePage() {
	return (
		<main className={homeShellClassName}>
			<AppHeader />

			<section
				className={heroSectionClassName}
				id="dashboard"
				aria-labelledby="home-title"
			>
				<div className={heroCardClassName}>
					<p className={eyebrowClassName}>
						Serene Ledger
					</p>
					<h1
						className={heroTitleClassName}
						id="home-title"
					>
						Tu casa financiera, ordenada y tranquila.
					</h1>
					<p className={heroDescriptionClassName}>
						Un panel inicial para administrar pagos del hogar con acciones por
						tema, datos de ejemplo y una navegación preparada para crecer.
					</p>
				</div>

				<aside
					className={summaryCardClassName}
					aria-label="Monthly overview"
				>
					<div>
						<p className={summaryLabelClassName}>
							Monthly overview
						</p>
						<p className={summaryTotalClassName}>
							50
						</p>
					</div>
					<div
						className="h-2 overflow-hidden rounded-full bg-white/20"
						aria-hidden="true"
					>
						<span className="block h-full w-[68%] rounded-[inherit] bg-[var(--secondary-container)]" />
					</div>
					<p className={summaryNoteClassName}>
						mock records listos para revisar
					</p>
				</aside>
			</section>

			<HomeDashboard />
		</main>
	);
}
