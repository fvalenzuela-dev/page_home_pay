import type { Metadata } from "next";

import CategoriesScreen from "./CategoriesScreen";

export const metadata: Metadata = {
	title: "Categorías | Page Home Pay",
	description: "Gestión paginada de categorías de pagos y facturas.",
};

export default function CategoriesPage() {
	return <CategoriesScreen />;
}
