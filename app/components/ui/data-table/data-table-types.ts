import type { ColumnDef } from "@tanstack/react-table";
import type { Key, ReactNode } from "react";

export type RowIdGetter<TData> = (record: TData) => Key;
export type SearchableValuesGetter<TData> = (record: TData) => unknown[];
export type TotalSummaryRenderer = (count: number) => ReactNode;

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
	emptyMessage?: ReactNode;
}
