import { flexRender, type Table } from "@tanstack/react-table";
import type { ReactNode } from "react";

const tableCellClassName =
	"border-b border-[var(--outline-variant)] px-4 py-3.5 text-left align-middle last:text-right group-last/row:border-b-0";

const tableRowClassName =
	"group/row even:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container)] data-[state=selected]:bg-[var(--secondary-container)]";

interface DataTableBodyProps<TData> {
	table: Table<TData>;
	columnsLength: number;
	emptyMessage: ReactNode;
}

export function DataTableBody<TData>({
	table,
	columnsLength,
	emptyMessage,
}: DataTableBodyProps<TData>) {
	const visibleRows = table.getRowModel().rows;

	if (visibleRows.length === 0) {
		return (
			<tr className="group/row">
				<td className={tableCellClassName} colSpan={columnsLength}>
					{emptyMessage}
				</td>
			</tr>
		);
	}

	return visibleRows.map((row) => (
		<tr
			className={tableRowClassName}
			data-state={row.getIsSelected() ? "selected" : undefined}
			key={row.id}
		>
			{row.getVisibleCells().map((cell) => (
				<td className={tableCellClassName} key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</td>
			))}
		</tr>
	));
}
