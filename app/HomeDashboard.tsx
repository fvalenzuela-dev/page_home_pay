"use client";

import { useMemo, useState } from "react";
import {
	CATEGORY_COLOR_OPTIONS,
	type CategoryColor,
} from "./categories/categoryOptions";

export interface HomeRecord {
	id: number;
	merchant: string;
	category: string;
	dueDate: string;
	amount: string;
	status: "Scheduled" | "Paid" | "Review" | "Overdue";
	color: CategoryColor;
}

interface HomeDashboardViewProps {
	records: HomeRecord[];
	page: number;
	pageSize: number;
	totalRecords: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
}

const merchantNames = [
	"Electricidad del Sur",
	"Internet Hogar",
	"Seguro familiar",
	"Agua metropolitana",
	"Gas residencial",
	"Streaming familiar",
	"Colegio Norte",
	"Telefonía móvil",
	"Expensas edificio",
	"Tarjeta principal",
];

const categories = [
	"Servicios",
	"Conectividad",
	"Protección",
	"Hogar",
	"Educación",
];

const statuses: HomeRecord["status"][] = [
	"Scheduled",
	"Paid",
	"Review",
	"Overdue",
];

export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export const MOCK_HOME_RECORDS: HomeRecord[] = Array.from(
	{ length: 50 },
	(_, index) => {
		const colorOption =
			CATEGORY_COLOR_OPTIONS[index % CATEGORY_COLOR_OPTIONS.length];
		const amount = 18_500 + index * 1350;

		return {
			id: index + 1,
			merchant: `${merchantNames[index % merchantNames.length]} ${index + 1}`,
			category: categories[index % categories.length],
			dueDate: `2026-06-${String((index % 28) + 1).padStart(2, "0")}`,
			amount: new Intl.NumberFormat("es-AR", {
				style: "currency",
				currency: "ARS",
				maximumFractionDigits: 0,
			}).format(amount),
			status: statuses[index % statuses.length],
			color: colorOption.value,
		};
	},
);

export function getPaginatedHomeRecords(
	records: HomeRecord[],
	page: number,
	pageSize: number,
) {
	const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
	const safePage = Math.min(Math.max(page, 1), totalPages);
	const start = (safePage - 1) * pageSize;

	return {
		page: safePage,
		totalPages,
		records: records.slice(start, start + pageSize),
	};
}

export function HomeDashboardView({
	records,
	page,
	pageSize,
	totalRecords,
	totalPages,
	onPageChange,
	onPageSizeChange,
}: HomeDashboardViewProps) {
	const startRecord = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;
	const endRecord = Math.min(page * pageSize, totalRecords);

	return (
		<section
			className="dashboard-layout"
			aria-label="Payment dashboard preview"
		>
			<article className="panel theme-actions-panel" id="administración">
				<div className="panel-header">
					<div>
						<p className="card-label">Administración</p>
						<h2>Acciones por tema</h2>
					</div>
					<a className="secondary-action" href="#payment-grid">
						Ver grilla
					</a>
				</div>

				<form className="theme-actions-form" aria-label="Theme color actions">
					{CATEGORY_COLOR_OPTIONS.map((option) => (
						<button
							className={`theme-action-button theme-action-${option.value}`}
							key={option.value}
							type="button"
						>
							<span>{option.label}</span>
							<small>{option.value}</small>
						</button>
					))}
				</form>
			</article>

			<article className="panel grid-panel" id="payment-grid">
				<div className="panel-header grid-panel-header">
					<div>
						<p className="card-label">Mock data grid</p>
						<h2>Pagos del hogar</h2>
					</div>
					<label className="page-size-control">
						<span>Filas por página</span>
						<select
							aria-label="Rows per page"
							value={pageSize}
							onChange={(event) => onPageSizeChange(Number(event.target.value))}
						>
							{PAGE_SIZE_OPTIONS.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
					</label>
				</div>

				<div className="home-table-wrap">
					<table className="home-table">
						<caption>
							Showing {startRecord}-{endRecord} of {totalRecords} mock records
						</caption>
						<thead>
							<tr>
								<th scope="col">Merchant</th>
								<th scope="col">Category</th>
								<th scope="col">Due date</th>
								<th scope="col">Status</th>
								<th scope="col">Amount</th>
							</tr>
						</thead>
						<tbody>
							{records.map((record) => (
								<tr key={record.id}>
									<td>
										<span
											className={`home-record-dot categories-color-${record.color}`}
											aria-hidden="true"
										/>
										{record.merchant}
									</td>
									<td>{record.category}</td>
									<td>{record.dueDate}</td>
									<td>
										<span
											className={`status-chip ${record.status.toLowerCase()}`}
										>
											{record.status}
										</span>
									</td>
									<td>{record.amount}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<nav className="home-pagination" aria-label="Payment grid pagination">
					<button
						disabled={page <= 1}
						type="button"
						onClick={() => onPageChange(page - 1)}
					>
						Anterior
					</button>
					<span>
						Página {page} de {totalPages}
					</span>
					<button
						disabled={page >= totalPages}
						type="button"
						onClick={() => onPageChange(page + 1)}
					>
						Siguiente
					</button>
				</nav>
			</article>

			<article className="panel contact-panel" id="contacto">
				<p className="card-label">Contacto</p>
				<h2>Base lista para crecer</h2>
				<p>
					La estructura combina acciones temáticas, una grilla realista y
					controles de paginación para incorporar próximos módulos sin
					reescribir el layout.
				</p>
			</article>
		</section>
	);
}

export default function HomeDashboard() {
	const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
	const [page, setPage] = useState(1);
	const pagination = useMemo(
		() => getPaginatedHomeRecords(MOCK_HOME_RECORDS, page, pageSize),
		[page, pageSize],
	);

	function handlePageSizeChange(nextPageSize: number) {
		setPageSize(nextPageSize);
		setPage(1);
	}

	return (
		<HomeDashboardView
			records={pagination.records}
			page={pagination.page}
			pageSize={pageSize}
			totalRecords={MOCK_HOME_RECORDS.length}
			totalPages={pagination.totalPages}
			onPageChange={setPage}
			onPageSizeChange={handlePageSizeChange}
		/>
	);
}
