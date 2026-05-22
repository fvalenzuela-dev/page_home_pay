import type { ColumnDef } from "@tanstack/react-table";
import type { Key, ReactNode } from "react";

export type RowIdGetter<TData> = (...args: [TData]) => Key;
export type SearchableValuesGetter<TData> = (...args: [TData]) => unknown[];
export type TotalSummaryRenderer = (...args: [number]) => ReactNode;

export interface DataTableServerPagination {
	page: number;
	totalPages: number;
	canPreviousPage: boolean;
	canNextPage: boolean;
	onPreviousPage: () => void;
	onNextPage: () => void;
	hidePageSize?: boolean;
}

export interface DataTableProps<TData, TValue> {
	id?: string;
	eyebrow: ReactNode;
	title: ReactNode;
	data: TData[];
	columns: ColumnDef<TData, TValue>[];
	getRowId?: RowIdGetter<TData>;
	searchPlaceholder?: string;
	searchColumnIds?: string[];
	getSearchableRowValues?: SearchableValuesGetter<TData>;
	filters?: ReactNode;
	initialPageSize?: number;
	pageSizeOptions?: readonly number[];
	totalSummary?: TotalSummaryRenderer;
	paginationLabel?: string;
	serverPagination?: DataTableServerPagination;
	emptyMessage?: ReactNode;
}
