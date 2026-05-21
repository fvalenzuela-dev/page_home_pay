"use client";

import { DataTablePagination, PAGE_SIZE_OPTIONS } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableContent } from "./data-table-content";
import { DataTableTitle } from "./data-table-title";
import type { DataTableProps } from "./data-table-types";
import { useDataTable } from "./use-data-table";

export { DataTableColumnHeader } from "./data-table-column-header";
export { createGlobalFilter } from "./data-table-filter";
export { PAGE_SIZE_OPTIONS } from "./data-table-pagination";
export type { ColumnDef } from "@tanstack/react-table";

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
	const {
		id,
		eyebrow,
		title,
		data,
		columns,
		getRowId,
		searchPlaceholder,
		searchColumnIds,
		getSearchableRowValues,
		filters,
		initialPageSize = PAGE_SIZE_OPTIONS[0],
		pageSizeOptions = PAGE_SIZE_OPTIONS,
		totalSummary = (total) => `Total: ${total} registros`,
		paginationLabel = "Paginación de la tabla",
		emptyMessage = "No se encontraron registros.",
	} = props;
	const { filteredRows, globalFilter, handleGlobalFilterChange, table } = useDataTable({
		data,
		columns,
		getRowId,
		getSearchableRowValues,
		initialPageSize,
		searchColumnIds,
	});

	return (
		<article
			className="row-span-2 rounded-3xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6"
			id={id}
		>
			<DataTableTitle eyebrow={eyebrow} title={title} />

			<DataTableToolbar
				filters={filters}
				globalFilter={globalFilter}
				searchPlaceholder={searchPlaceholder}
				totalSummary={totalSummary(filteredRows)}
				onGlobalFilterChange={handleGlobalFilterChange}
			/>

			<DataTableContent
				columnsLength={columns.length}
				emptyMessage={emptyMessage}
				table={table}
			/>

			<DataTablePagination
				label={paginationLabel}
				pageSizeOptions={pageSizeOptions}
				table={table}
			/>
		</article>
	);
}
