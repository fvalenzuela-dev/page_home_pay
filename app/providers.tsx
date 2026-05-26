"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import Toastify from "./components/ui/Toastify";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			{children}
			<Toastify />
		</ThemeProvider>
	);
}
