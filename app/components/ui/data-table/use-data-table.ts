import {
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { createGlobalFilter } from "./data-table-filter";
import { PAGE_SIZE_OPTIONS } from "./data-table-pagination";
import type { DataTableProps } from "./data-table-types";

export function useDataTable<TData, TValue>(
	props: Pick<
		DataTableProps<TData, TValue>,
		| "columns"
		| "data"
		| "getRowId"
		| "getSearchableRowValues"
		| "initialPageSize"
		| "searchColumnIds"
	>,
) {
	const { columns, data, getRowId, getSearchableRowValues, searchColumnIds } = props;
	const initialPageSize = props.initialPageSize ?? PAGE_SIZE_OPTIONS[0];
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	// eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table owns internal table functions for this reusable client component.
	const table = useReactTable({
		data,
		columns,
		state: { sorting, globalFilter },
		initialState: { pagination: { pageSize: initialPageSize } },
		globalFilterFn: createGlobalFilter(searchColumnIds, getSearchableRowValues),
		getRowId: getRowId ? (row) => String(getRowId(row)) : undefined,
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	function handleGlobalFilterChange(nextValue: string) {
		setGlobalFilter(nextValue);
		table.setPageIndex(0);
	}

	return {
		filteredRows: table.getFilteredRowModel().rows.length,
		globalFilter,
		handleGlobalFilterChange,
		table,
	};
}
