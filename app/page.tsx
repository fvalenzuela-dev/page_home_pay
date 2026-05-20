import AppHeader from "./AppHeader";
import HomeDashboard from "./HomeDashboard";

export default function HomePage() {
	return (
		<main className="app-shell">
			<AppHeader />

			<section
				className="hero-section"
				id="dashboard"
				aria-labelledby="home-title"
			>
				<div className="hero-copy">
					<p className="eyebrow">Serene Ledger</p>
					<h1 id="home-title">Tu casa financiera, ordenada y tranquila.</h1>
					<p>
						Un panel inicial para administrar pagos del hogar con acciones por
						tema, datos de ejemplo y una navegación preparada para crecer.
					</p>
				</div>

				<aside className="summary-card" aria-label="Monthly overview">
					<div>
						<p className="card-label">Monthly overview</p>
						<p className="summary-total">50</p>
					</div>
					<div className="progress-track" aria-hidden="true">
						<span />
					</div>
					<p className="summary-note">mock records listos para revisar</p>
				</aside>
			</section>

			<HomeDashboard />
		</main>
	);
}
