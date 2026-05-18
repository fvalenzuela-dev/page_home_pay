import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
	title: "Page Home Pay",
	description: "Home payment management application",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body>{children}</body>
			</html>
		</ClerkProvider>
	);
}
