import type { SearchableValuesGetter } from "./data-table-types";

interface GlobalFilterRow<TData> {
	original: TData;
	getValue: (...args: [string]) => unknown;
	getAllCells: () => { getValue: () => unknown }[];
}

function stringifyCellValue(value: unknown) {
	if (value === null || value === undefined) {
		return "";
	}

	return String(value).toLowerCase();
}

export function createGlobalFilter<TData>(
	columnIds?: string[],
	getSearchableRowValues?: SearchableValuesGetter<TData>,
) {
	return (
		row: GlobalFilterRow<TData>,
		_columnId: string,
		filterValue: unknown,
		_addMeta?: unknown,
	) => {
		void _addMeta;
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
