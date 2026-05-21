import { flexRender, type Table } from "@tanstack/react-table";

const tableHeaderCellClassName =
	"border-b border-[var(--outline-variant)] bg-[color-mix(in_srgb,var(--primary-container)_28%,var(--surface-container-lowest))] px-4 py-3.5 text-left align-middle text-xs tracking-[0.08em] text-[var(--on-surface-variant)] uppercase last:text-right";

interface DataTableHeaderProps<TData> {
	table: Table<TData>;
}

export function DataTableHeader<TData>({ table }: DataTableHeaderProps<TData>) {
	return table.getHeaderGroups().map((headerGroup) => (
		<tr key={headerGroup.id}>
			{headerGroup.headers.map((header) => (
				<th className={tableHeaderCellClassName} key={header.id} scope="col">
					{header.isPlaceholder
						? null
						: flexRender(header.column.columnDef.header, header.getContext())}
				</th>
			))}
		</tr>
	));
}
