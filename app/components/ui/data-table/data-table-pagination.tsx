import type { Table } from "@tanstack/react-table";
import Button from "../Button";
import type { DataTableServerPagination } from "./data-table-types";

export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
	pageSizeOptions?: readonly number[];
	label?: string;
	serverPagination?: DataTableServerPagination;
}

export function DataTablePagination<TData>({
	table,
	pageSizeOptions = PAGE_SIZE_OPTIONS,
	label = "Paginación de la tabla",
	serverPagination,
}: DataTablePaginationProps<TData>) {
	const page = serverPagination?.page ?? table.getState().pagination.pageIndex + 1;
	const totalPages = Math.max(
		1,
		serverPagination?.totalPages ?? table.getPageCount(),
	);
	const canPreviousPage =
		serverPagination?.canPreviousPage ?? table.getCanPreviousPage();
	const canNextPage = serverPagination?.canNextPage ?? table.getCanNextPage();
	const showPageSize = serverPagination?.hidePageSize !== true;
	const handlePreviousPage = serverPagination?.onPreviousPage ?? table.previousPage;
	const handleNextPage = serverPagination?.onNextPage ?? table.nextPage;
	const pageSize =
		serverPagination?.pageSize ?? table.getState().pagination.pageSize;

	return (
		<nav
			className="flex flex-wrap items-center justify-between gap-3 pt-4 text-[var(--on-surface-variant)] max-[560px]:flex-col max-[560px]:items-stretch"
			aria-label={label}
		>
			{showPageSize ? (
				<label className="grid gap-1.5 text-[0.8rem] font-bold text-[var(--on-surface-variant)] max-[560px]:w-full">
					<span>Filas por página</span>
					<select
						className="min-w-28 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3.5 py-2.5 pr-8 font-[inherit] text-[var(--on-surface)]"
						aria-label="Filas por página"
						value={pageSize}
						onChange={(event) => {
							const nextPageSize = Number(event.target.value);

							table.setPageSize(nextPageSize);
							serverPagination?.onPageSizeChange?.(nextPageSize);
						}}
					>
						{pageSizeOptions.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</label>
			) : null}

			<div className="flex flex-wrap items-center justify-end gap-3 max-[560px]:grid max-[560px]:grid-cols-1">
				<Button
					className="rounded-full max-[560px]:w-full"
					disabled={!canPreviousPage}
					size="md"
					variant="outline"
					onClick={handlePreviousPage}
				>
					Anterior
				</Button>
				<span>
					Página {page} de {totalPages}
				</span>
				<Button
					className="rounded-full max-[560px]:w-full"
					disabled={!canNextPage}
					size="md"
					variant="outline"
					onClick={handleNextPage}
				>
					Siguiente
				</Button>
			</div>
		</nav>
	);
}
