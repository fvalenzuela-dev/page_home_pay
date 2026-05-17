import { UserButton } from "@clerk/nextjs";

const navigationItems = ["Dashboard", "Administración", "Contacto"];

const upcomingBills = [
	{
		merchant: "Electricidad del Sur",
		category: "Servicios",
		amount: "$42.800",
		status: "Pending",
	},
	{
		merchant: "Internet Hogar",
		category: "Conectividad",
		amount: "$31.200",
		status: "Paid",
	},
	{
		merchant: "Seguro familiar",
		category: "Protección",
		amount: "$58.900",
		status: "Overdue",
	},
];

export default function HomePage() {
	return (
		<main className="app-shell">
			<header className="top-navigation">
				<a
					className="brand-mark"
					href="#dashboard"
					aria-label="Page Home Pay home"
				>
					<span className="brand-icon" aria-hidden="true">
						P
					</span>
					<span>Page Home Pay</span>
				</a>

				<nav className="nav-menu" aria-label="Main menu">
					{navigationItems.map((item) => (
						<a key={item} href={`#${item.toLowerCase()}`}>
							{item}
						</a>
					))}
				</nav>

				<fieldset className="user-actions">
					<legend className="sr-only">Logged-in user management</legend>
					<label className="theme-toggle" htmlFor="theme-switch">
						<input
							id="theme-switch"
							type="checkbox"
							aria-label="Toggle dark and light theme"
						/>
						<span className="theme-icon light-icon" aria-hidden="true">
							☀
						</span>
						<span className="theme-icon dark-icon" aria-hidden="true">
							☾
						</span>
						<span className="sr-only">Toggle dark and light theme</span>
					</label>
					<div className="account-menu" aria-label="User profile menu">
						<UserButton
							showName
							userProfileMode="modal"
							appearance={{
								elements: {
									userButtonTrigger: "account-menu-trigger",
									userButtonBox: "account-menu-box",
									userButtonOuterIdentifier: "account-menu-name",
									avatarBox: "account-menu-avatar",
								},
							}}
						/>
					</div>
				</fieldset>
			</header>

			<section
				className="hero-section"
				id="dashboard"
				aria-labelledby="home-title"
			>
				<div className="hero-copy">
					<p className="eyebrow">Serene Ledger</p>
					<h1 id="home-title">Tu casa financiera, ordenada y tranquila.</h1>
					<p>
						Un shell inicial para administrar pagos del hogar con navegación,
						espacio de usuario y una base visual preparada para los próximos
						módulos.
					</p>
				</div>

				<aside className="summary-card" aria-label="Monthly overview">
					<div>
						<p className="card-label">Monthly overview</p>
						<p className="summary-total">$132.900</p>
					</div>
					<div className="progress-track" aria-hidden="true">
						<span />
					</div>
					<p className="summary-note">68% de pagos del mes bajo control</p>
				</aside>
			</section>

			<section className="content-grid" aria-label="Application sections">
				<article className="panel" id="administración">
					<div className="panel-header">
						<div>
							<p className="card-label">Administración</p>
							<h2>Próximos pagos</h2>
						</div>
						<a className="secondary-action" href="#contacto">
							Ver soporte
						</a>
					</div>

					<div className="bill-list">
						{upcomingBills.map((bill) => (
							<div className="bill-row" key={bill.merchant}>
								<span className="bill-icon" aria-hidden="true">
									{bill.merchant.slice(0, 1)}
								</span>
								<div className="bill-main">
									<strong>{bill.merchant}</strong>
									<span>{bill.category}</span>
								</div>
								<div className="bill-meta">
									<span className="amount">{bill.amount}</span>
									<span className={`status-chip ${bill.status.toLowerCase()}`}>
										{bill.status}
									</span>
								</div>
							</div>
						))}
					</div>
				</article>

				<article className="panel contact-panel" id="contacto">
					<p className="card-label">Contacto</p>
					<h2>Base lista para crecer</h2>
					<p>
						La estructura separa navegación, acciones de cuenta y contenido para
						incorporar dashboard, categorías y autenticación sin reescribir el
						layout.
					</p>
				</article>
			</section>
		</main>
	);
}
