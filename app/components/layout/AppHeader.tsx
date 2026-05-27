"use client";

import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

interface NavigationItem {
	label: string;
	href: string;
	children?: NavigationItem[];
}

type NavigationMenuItem = NavigationItem & { children: NavigationItem[] };

interface AppHeaderProps {
	homeHrefPrefix?: string;
}

const headerClassName =
	"sticky top-0 z-10 -mx-4 -mt-4 flex w-[calc(100%+2rem)] items-center justify-between gap-5 border-b border-[var(--header-border)] bg-[var(--header-bg)] p-4 text-[var(--header-text)] shadow-primary backdrop-blur-md [--header-bg:rgb(255_255_255_/_0.92)] [--header-border:rgb(203_213_225)] [--header-muted:rgb(107_114_128)] [--header-primary:rgb(37_99_235)] [--header-surface:rgb(241_245_249)] [--header-text:rgb(17_24_39)] [.dark_&]:[--header-bg:rgb(15_23_42_/_0.94)] [.dark_&]:[--header-border:rgb(51_65_85)] [.dark_&]:[--header-muted:rgb(203_213_225)] [.dark_&]:[--header-primary:rgb(96_165_250)] [.dark_&]:[--header-surface:rgb(30_41_59)] [.dark_&]:[--header-text:rgb(241_245_249)] max-lg:grid max-lg:grid-cols-1 max-sm:-mx-3 max-sm:-mt-3 max-sm:w-[calc(100%+1.5rem)]";
const logoClassName = "flex items-center";
const logoImageClassName = "size-24 rounded-2xl object-contain";
const navClassName =
	"flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[var(--header-surface)] p-1.5 max-lg:w-full max-lg:flex-wrap max-lg:items-stretch max-lg:justify-between max-lg:overflow-visible max-lg:rounded-3xl";
const navItemClassName =
	"rounded-full px-5 py-3 text-sm font-semibold text-[var(--header-muted)] transition-colors duration-150";
const activeNavItemClassName =
	"bg-[var(--header-bg)] text-[var(--header-primary)] shadow-sm";
const navMenuClassName = "group relative max-lg:min-w-max";
const navMenuSummaryClassName = `${navItemClassName} inline-flex cursor-pointer list-none items-center gap-2 border border-transparent hover:bg-[var(--header-bg)] hover:text-[var(--header-primary)] hover:shadow-sm focus-visible:bg-[var(--header-bg)] focus-visible:text-[var(--header-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--header-primary)] group-open:border-[var(--header-border)] group-open:bg-[var(--header-bg)] group-open:text-[var(--header-primary)] group-open:shadow-sm [&::-webkit-details-marker]:hidden`;
const navMenuIconClassName =
	"text-xs transition-transform duration-150 group-open:rotate-180";
const navPanelClassName =
	"absolute top-full left-1/2 z-20 mt-3 grid min-w-56 -translate-x-1/2 gap-1 rounded-3xl border border-[var(--header-border)] bg-[var(--header-bg)] p-2 shadow-primary-lg ring-1 ring-[var(--header-border)]/40 max-lg:static max-lg:mt-2 max-lg:translate-x-0 max-lg:shadow-none";
const navPanelLinkClassName = `${navItemClassName} rounded-2xl px-4 py-3 hover:bg-[var(--header-surface)] hover:text-[var(--header-primary)] focus-visible:bg-[var(--header-surface)] focus-visible:text-[var(--header-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--header-primary)]`;
const userActionsClassName =
	"m-0 flex min-w-0 items-center gap-2 border-0 p-0 max-lg:w-full max-lg:flex-wrap max-lg:justify-between";
const themeToggleClassName =
	"relative inline-grid size-11 place-items-center rounded-full border border-[var(--header-border)] bg-transparent font-semibold text-[var(--header-text)] hover:border-[var(--header-primary)] focus-within:border-[var(--header-primary)] focus-within:shadow-primary focus-within:outline-2 focus-within:outline-transparent focus-within:outline-offset-2 max-sm:w-full";
const accountMenuClassName =
	"flex items-center gap-2 rounded-full border border-[var(--header-border)] bg-transparent py-1 pr-2 pl-3 font-semibold text-[var(--header-text)] hover:border-[var(--header-primary)] max-sm:w-full max-sm:justify-center";

function withPrefix(prefix: string, href: string) {
	return href.startsWith("#") ? `${prefix}${href}` : href;
}

function NavigationLink({
	href,
	children,
	className,
}: Pick<NavigationItem, "href"> & { children: string; className?: string }) {
	return href.startsWith("/") && !href.includes("#") ? (
		<Link className={className} href={href}>
			{children}
		</Link>
	) : (
		<a className={className} href={href}>
			{children}
		</a>
	);
}

function getNavigationItems(homeHrefPrefix: string): NavigationItem[] {
	return [
		{ label: "Dashboard", href: withPrefix(homeHrefPrefix, "#dashboard") },
		{
			label: "Administración",
			href: withPrefix(homeHrefPrefix, "#administracion"),
			children: [{ label: "Categorías", href: "/categories" }],
		},
		{ label: "Contacto", href: withPrefix(homeHrefPrefix, "#contacto") },
	];
}

function HeaderLogo() {
	return (
		<Link className={logoClassName} href="/" aria-label="Page Home Pay home">
			<Image
				className={logoImageClassName}
				src="/images/logo.png"
				alt="Page Home Pay"
				width={96}
				height={96}
				priority
			/>
		</Link>
	);
}

function HeaderNav({ items }: { items: NavigationItem[] }) {
	return (
		<nav className={navClassName} aria-label="Main menu">
			{items.map((item, index) =>
				item.children !== undefined ? (
					<HeaderNavMenu
						key={item.label}
						item={{ ...item, children: item.children }}
					/>
				) : (
					<NavigationLink
						className={`${navItemClassName} ${index === 0 ? activeNavItemClassName : ""}`}
						key={item.label}
						href={item.href}
					>
						{item.label}
					</NavigationLink>
				),
			)}
		</nav>
	);
}

function HeaderNavMenu({ item }: { item: NavigationMenuItem }) {
	return (
		<details className={navMenuClassName}>
			<summary className={navMenuSummaryClassName}>
				{item.label}
				<span className={navMenuIconClassName} aria-hidden="true">
					⌄
				</span>
			</summary>
			<div className={navPanelClassName}>
				<NavigationLink className={navPanelLinkClassName} href={item.href}>
					Vista general
				</NavigationLink>
				{item.children.map((child) => (
					<NavigationLink
						className={navPanelLinkClassName}
						key={child.label}
						href={child.href}
					>
						{child.label}
					</NavigationLink>
				))}
			</div>
		</details>
	);
}

function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const isDarkTheme = resolvedTheme === "dark";

	return (
		<label className={themeToggleClassName} htmlFor="theme-switch">
			<input
				checked={isDarkTheme}
				className="peer absolute inset-0 m-0 cursor-pointer opacity-0"
				id="theme-switch"
				type="checkbox"
				aria-label="Toggle dark and light theme"
				onChange={(event) => {
					setTheme(event.currentTarget.checked ? "dark" : "light");
				}}
			/>
			<span
				className="col-start-1 row-start-1 text-lg leading-none transition-[opacity,transform] duration-150 peer-checked:scale-75 peer-checked:-rotate-20 peer-checked:opacity-0"
				aria-hidden="true"
			>
				☀
			</span>
			<span
				className="col-start-1 row-start-1 scale-75 -rotate-20 text-lg leading-none opacity-0 transition-[opacity,transform] duration-150 peer-checked:scale-100 peer-checked:rotate-0 peer-checked:opacity-100"
				aria-hidden="true"
			>
				☾
			</span>
			<span className="sr-only">Toggle dark and light theme</span>
		</label>
	);
}

function AccountMenu() {
	return (
		<div className={accountMenuClassName}>
			<UserButton
				showName
				userProfileMode="modal"
				appearance={{
					elements: {
						userButtonTrigger:
							"min-h-10 rounded-full text-[var(--header-text)]",
						userButtonBox: "flex flex-row-reverse items-center gap-2.5",
						userButtonOuterIdentifier: "font-bold text-[var(--header-text)]",
						avatarBox: "size-9",
					},
				}}
			/>
		</div>
	);
}

function HeaderUserActions() {
	return (
		<fieldset className={userActionsClassName}>
			<legend className="sr-only">Logged-in user management</legend>
			<ThemeToggle />
			<AccountMenu />
		</fieldset>
	);
}

export default function AppHeader({ homeHrefPrefix = "" }: AppHeaderProps) {
	return (
		<header className={headerClassName}>
			<HeaderLogo />
			<HeaderNav items={getNavigationItems(homeHrefPrefix)} />
			<HeaderUserActions />
		</header>
	);
}
