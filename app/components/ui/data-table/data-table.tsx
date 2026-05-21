"use client";

import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type FilterFn,
	type Row,
	type SortingState,
} from "@tanstack/react-table";
import { useState, type Key, type ReactNode } from "react";
import { DataTablePagination, PAGE_SIZE_OPTIONS } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

export { DataTableColumnHeader } from "./data-table-column-header";
export { PAGE_SIZE_OPTIONS } from "./data-table-pagination";
export type { ColumnDef } from "@tanstack/react-table";

interface DataTableProps<TData, TValue> {
	id?: string;
	eyebrow: ReactNode;
	title: ReactNode;
	data: TData[];
	columns: ColumnDef<TData, TValue>[];
	getRowId?: (row: TData) => Key;
	searchPlaceholder?: string;
	searchColumnIds?: string[];
	getSearchableRowValues?: (row: TData) => unknown[];
	filters?: ReactNode;
	initialPageSize?: number;
	pageSizeOptions?: readonly number[];
	totalSummary?: (totalRows: number) => ReactNode;
	paginationLabel?: string;
	emptyMessage?: ReactNode;
}

const tableHeaderCellClassName =
	"border-b border-[var(--outline-variant)] bg-[color-mix(in_srgb,var(--primary-container)_28%,var(--surface-container-lowest))] px-4 py-3.5 text-left align-middle text-xs tracking-[0.08em] text-[var(--on-surface-variant)] uppercase last:text-right";

const tableCellClassName =
	"border-b border-[var(--outline-variant)] px-4 py-3.5 text-left align-middle last:text-right group-last/row:border-b-0";

const tableRowClassName =
	"group/row even:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container)] data-[state=selected]:bg-[var(--secondary-container)]";

function stringifyCellValue(value: unknown) {
	if (value === null || value === undefined) {
		return "";
	}

	return String(value).toLowerCase();
}

export function createGlobalFilter<TData>(
	columnIds?: string[],
	getSearchableRowValues?: (row: TData) => unknown[],
): FilterFn<TData> {
	return (row: Row<TData>, _columnId: string, filterValue: unknown) => {
		const query = String(filterValue ?? "").trim().toLowerCase();

		if (!query) {
			return true;
		}

		const searchableCells = columnIds?.length
			? columnIds.map((id) => row.getValue(id))
			: row.getAllCells().map((cell) => cell.getValue());
		const searchableValues = [
			...searchableCells,
			...(getSearchableRowValues?.(row.original) ?? []),
		];

		return searchableValues.some((value) =>
			stringifyCellValue(value).includes(query),
		);
	};
}

export function DataTable<TData, TValue>({
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
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	// eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table owns internal table functions for this reusable client component.
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			globalFilter,
		},
		initialState: {
			pagination: {
				pageSize: initialPageSize,
			},
		},
		globalFilterFn: createGlobalFilter(searchColumnIds, getSearchableRowValues),
		getRowId: getRowId ? (row) => String(getRowId(row)) : undefined,
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});
	const filteredRows = table.getFilteredRowModel().rows.length;
	const visibleRows = table.getRowModel().rows;

	function handleGlobalFilterChange(value: string) {
		setGlobalFilter(value);
		table.setPageIndex(0);
	}

	return (
		<article
			className="row-span-2 rounded-3xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6"
			id={id}
		>
			<div className="mb-6 flex items-center justify-between gap-4 max-[560px]:grid max-[560px]:grid-cols-1">
				<div>
					<p className="text-xs leading-4 font-semibold tracking-[0.08em] text-[var(--on-surface-variant)] uppercase">
						{eyebrow}
					</p>
					<h2 className="mt-2 font-['Manrope',Inter,ui-sans-serif,system-ui,sans-serif] text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] tracking-[-0.02em]">
						{title}
					</h2>
				</div>
			</div>

			<DataTableToolbar
				filters={filters}
				globalFilter={globalFilter}
				searchPlaceholder={searchPlaceholder}
				totalSummary={totalSummary(filteredRows)}
				onGlobalFilterChange={handleGlobalFilterChange}
			/>

			<div className="overflow-x-auto rounded-2xl border border-[var(--outline-variant)]">
				<table className="w-full min-w-[680px] border-collapse">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										className={tableHeaderCellClassName}
										key={header.id}
										scope="col"
									>
										{header.isPlaceholder
											? null
											: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{visibleRows.length > 0 ? (
							visibleRows.map((row) => (
								<tr
									className={tableRowClassName}
									data-state={row.getIsSelected() ? "selected" : undefined}
									key={row.id}
								>
									{row.getVisibleCells().map((cell) => (
										<td className={tableCellClassName} key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</td>
									))}
								</tr>
							))
						) : (
							<tr className="group/row">
								<td className={tableCellClassName} colSpan={columns.length}>
									{emptyMessage}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<DataTablePagination
				label={paginationLabel}
				pageSizeOptions={pageSizeOptions}
				table={table}
			/>
		</article>
	);
}
