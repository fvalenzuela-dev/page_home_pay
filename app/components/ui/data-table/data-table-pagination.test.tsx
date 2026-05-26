import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Table } from "@tanstack/react-table";
import { describe, expect, it, vi } from "vitest";

import { DataTablePagination } from "./data-table-pagination";

type ElementProps = Record<string, unknown> & {
	children?: ReactNode;
};

function collectElements(node: ReactNode): ReactElement<ElementProps>[] {
	if (!isValidElement<ElementProps>(node)) {
		return [];
	}

	return [
		node,
		...Children.toArray(node.props.children).flatMap((child) =>
			collectElements(child),
		),
	];
}

function asElement(node: unknown): ReactElement<ElementProps> {
	if (!isValidElement<ElementProps>(node)) {
		throw new Error("Expected a React element");
	}

	return node;
}

function createTable(pageSize = 20) {
	return {
		getState: () => ({ pagination: { pageIndex: 0, pageSize } }),
		getPageCount: () => 1,
		getCanPreviousPage: () => false,
		getCanNextPage: () => false,
		previousPage: vi.fn(),
		nextPage: vi.fn(),
		setPageSize: vi.fn(),
	} as unknown as Table<unknown>;
}

describe("DataTablePagination", () => {
	it("keeps client-side page size changes local by default", () => {
		const table = createTable(25);
		const view = DataTablePagination({ table });
		const select = asElement(
			collectElements(view).find((element) => element.type === "select"),
		);

		(select.props.onChange as (event: { target: { value: string } }) => void)({
			target: { value: "50" },
		});

		expect(table.setPageSize).toHaveBeenCalledWith(50);
	});

	it("notifies server pagination when the page size selector changes", () => {
		const table = createTable(20);
		const onPageSizeChange = vi.fn();
		const view = DataTablePagination({
			table,
			serverPagination: {
				page: 2,
				pageSize: 20,
				totalPages: 4,
				canPreviousPage: true,
				canNextPage: true,
				onPreviousPage: vi.fn(),
				onNextPage: vi.fn(),
				onPageSizeChange,
			},
		});
		const select = asElement(
			collectElements(view).find((element) => element.type === "select"),
		);

		(select.props.onChange as (event: { target: { value: string } }) => void)({
			target: { value: "10" },
		});

		expect(table.setPageSize).toHaveBeenCalledWith(10);
		expect(onPageSizeChange).toHaveBeenCalledWith(10);
	});

	it("uses theme-scoped tokens for previous and next buttons", () => {
		const table = createTable(25);
		const markup = renderToStaticMarkup(<DataTablePagination table={table} />);

		expect(markup).toContain("Anterior");
		expect(markup).toContain("Siguiente");
		expect(markup).toContain("border-[var(--outline-variant)]");
		expect(markup).toContain("bg-[var(--surface-container-lowest)]");
		expect(markup).toContain("text-[var(--on-surface)]");
		expect(markup).toContain("hover:bg-[var(--surface-container-high)]");
		expect(markup).toContain("focus-visible:outline-[var(--primary)]");
	});
});
