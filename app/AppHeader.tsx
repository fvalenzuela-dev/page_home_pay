"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface NavigationItem {
	label: string;
	href: string;
	children?: NavigationItem[];
}

interface AppHeaderProps {
	homeHrefPrefix?: string;
}

function withPrefix(prefix: string, href: string) {
	return href.startsWith("#") ? `${prefix}${href}` : href;
}

function NavigationLink({
	href,
	children,
}: Pick<NavigationItem, "href"> & { children: string }) {
	return href.startsWith("/") && !href.includes("#") ? (
		<Link href={href}>{children}</Link>
	) : (
		<a href={href}>{children}</a>
	);
}

export default function AppHeader({ homeHrefPrefix = "" }: AppHeaderProps) {
	const navigationItems: NavigationItem[] = [
		{ label: "Dashboard", href: withPrefix(homeHrefPrefix, "#dashboard") },
		{
			label: "Administración",
			href: withPrefix(homeHrefPrefix, "#administración"),
			children: [{ label: "Categorías", href: "/categories" }],
		},
		{ label: "Contacto", href: withPrefix(homeHrefPrefix, "#contacto") },
	];

	return (
		<header className="top-navigation">
			<Link className="brand-mark" href="/" aria-label="Page Home Pay home">
				<span className="brand-icon" aria-hidden="true">
					P
				</span>
				<span>Page Home Pay</span>
			</Link>

			<nav className="nav-menu" aria-label="Main menu">
				{navigationItems.map((item) =>
					item.children === undefined ? (
						<NavigationLink key={item.label} href={item.href}>
							{item.label}
						</NavigationLink>
					) : (
						<details className="nav-submenu" key={item.label}>
							<summary>{item.label}</summary>
							<div className="nav-submenu-panel">
								<NavigationLink href={item.href}>Vista general</NavigationLink>
								{item.children.map((child) => (
									<NavigationLink key={child.label} href={child.href}>
										{child.label}
									</NavigationLink>
								))}
							</div>
						</details>
					),
				)}
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
				<div className="account-menu">
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
	);
}
