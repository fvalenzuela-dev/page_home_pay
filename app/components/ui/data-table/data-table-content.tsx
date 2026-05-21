import type { Table } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { DataTableBody } from "./data-table-body";
import { DataTableHeader } from "./data-table-header";

interface DataTableContentProps<TData> {
	table: Table<TData>;
	columnsLength: number;
	emptyMessage: ReactNode;
}

export function DataTableContent<TData>({
	table,
	columnsLength,
	emptyMessage,
}: DataTableContentProps<TData>) {
	return (
		<div className="overflow-x-auto rounded-2xl border border-[var(--outline-variant)]">
			<table className="w-full min-w-[680px] border-collapse">
				<thead>
					<DataTableHeader table={table} />
				</thead>
				<tbody>
					<DataTableBody
						columnsLength={columnsLength}
						emptyMessage={emptyMessage}
						table={table}
					/>
				</tbody>
			</table>
		</div>
	);
}
