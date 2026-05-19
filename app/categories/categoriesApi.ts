export interface Category {
	id: number;
	name: string;
	colorApk: string;
	colorWeb: string;
	iconApk: string;
	iconWeb: string;
}

export interface UpdateCategoryInput {
	name: string;
	colorApk: string;
	colorWeb: string;
	iconApk: string;
	iconWeb: string;
}

export type CreateCategoryInput = UpdateCategoryInput;

export interface CategoriesPage {
	items: Category[];
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
}

export interface ListCategoriesParams {
	page: number;
	limit: number;
}

interface RawCategory {
	id?: number;
	name?: string;
	color_apk?: string;
	color_web?: string;
	icon_apk?: string;
	icon_web?: string;
}

type Fetcher = typeof fetch;
type TokenProvider = () => Promise<string | null>;

interface CategoriesApiOptions {
	baseUrl?: string;
	fetcher?: Fetcher;
	getToken?: TokenProvider;
}

interface PaginationShape {
	page?: number;
	limit?: number;
	page_size?: number;
	total?: number;
	total_items?: number;
	total_pages?: number;
}

export class CategoriesApiError extends Error {
	readonly status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "CategoriesApiError";
		this.status = status;
	}
}

const DEFAULT_LIMIT = 20;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function readNumber(value: unknown, fallback: number): number {
	return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readString(value: unknown): string {
	return typeof value === "string" ? value : "";
}

function normalizeCategory(raw: unknown): Category {
	const category = isRecord(raw) ? (raw as RawCategory) : {};

	return {
		id: readNumber(category.id, 0),
		name: readString(category.name),
		colorApk: readString(category.color_apk),
		colorWeb: readString(category.color_web),
		iconApk: readString(category.icon_apk),
		iconWeb: readString(category.icon_web),
	};
}

function readArrayPayload(payload: Record<string, unknown>): unknown[] {
	const candidates = [payload.data, payload.items, payload.categories];
	return candidates.find(Array.isArray) ?? [];
}

function readPagination(payload: Record<string, unknown>): PaginationShape {
	return isRecord(payload.pagination) ? payload.pagination : payload;
}

export function normalizeCategoriesPage(payload: unknown): CategoriesPage {
	const body = isRecord(payload) ? payload : {};
	const pagination = readPagination(body);
	const items = readArrayPayload(body).map(normalizeCategory);
	const page = readNumber(pagination.page, 1);
	const limit = readNumber(
		pagination.limit,
		readNumber(pagination.page_size, DEFAULT_LIMIT),
	);
	const totalItems = readNumber(
		pagination.total,
		readNumber(pagination.total_items, items.length),
	);
	const totalPages = readNumber(
		pagination.total_pages,
		Math.max(1, Math.ceil(totalItems / limit)),
	);

	return { items, page, limit, totalItems, totalPages };
}

function normalizeBaseUrl(baseUrl: string): string {
	return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function buildUrl(baseUrl: string | undefined, path: string): string {
	const normalizedBaseUrl = normalizeBaseUrl(baseUrl ?? getDefaultBaseUrl());
	return normalizedBaseUrl === "" ? path : `${normalizedBaseUrl}${path}`;
}

async function parseResponseBody(response: Response): Promise<unknown> {
	if (response.status === 204) {
		return null;
	}

	const text = await response.text();
	return text === "" ? null : JSON.parse(text);
}

function getErrorMessage(body: unknown): string {
	if (!isRecord(body)) {
		return "No pudimos completar la operación de categorías.";
	}

	const message = body.error ?? body.message;
	return typeof message === "string"
		? message
		: "No pudimos completar la operación de categorías.";
}

async function requestJson(
	fetcher: Fetcher,
	url: string,
	init: RequestInit,
): Promise<unknown> {
	const response = await fetcher(url, init);
	const body = await parseResponseBody(response);

	if (!response.ok) {
		throw new CategoriesApiError(getErrorMessage(body), response.status);
	}

	return body;
}

async function makeHeaders(getToken?: TokenProvider): Promise<HeadersInit> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};
	const token = await getToken?.();
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	return headers;
}

function getDefaultBaseUrl(): string {
	const baseUrl = process.env.NEXT_PUBLIC_HOMEPAY_API_BASE_URL;
	if (baseUrl === undefined || baseUrl.trim() === "") {
		throw new CategoriesApiError(
			"Configurá NEXT_PUBLIC_HOMEPAY_API_BASE_URL para consumir el backend de categorías.",
			0,
		);
	}

	return baseUrl;
}

export function createCategoriesApi(options: CategoriesApiOptions = {}) {
	const baseUrl = options.baseUrl;
	const fetcher = options.fetcher ?? fetch;
	const getToken = options.getToken;

	return {
		async listCategories(
			params: ListCategoriesParams,
		): Promise<CategoriesPage> {
			const query = new URLSearchParams({
				page: String(params.page),
				limit: String(params.limit),
			});
			const body = await requestJson(
				fetcher,
				buildUrl(baseUrl, `/categories?${query.toString()}`),
				{ headers: await makeHeaders(getToken) },
			);
			return normalizeCategoriesPage(body);
		},

		async createCategory(input: CreateCategoryInput): Promise<Category> {
			const body = await requestJson(
				fetcher,
				buildUrl(baseUrl, "/categories"),
				{
					method: "POST",
					headers: await makeHeaders(getToken),
					body: JSON.stringify({
						name: input.name,
						color_apk: input.colorApk,
						color_web: input.colorWeb,
						icon_apk: input.iconApk,
						icon_web: input.iconWeb,
					}),
				},
			);
			return normalizeCategory(body);
		},

		async updateCategory(
			id: number,
			input: UpdateCategoryInput,
		): Promise<Category> {
			const body = await requestJson(
				fetcher,
				buildUrl(baseUrl, `/categories/${id}`),
				{
					method: "PUT",
					headers: await makeHeaders(getToken),
					body: JSON.stringify({
						name: input.name,
						color_apk: input.colorApk,
						color_web: input.colorWeb,
						icon_apk: input.iconApk,
						icon_web: input.iconWeb,
					}),
				},
			);
			return normalizeCategory(body);
		},

		async deleteCategory(id: number): Promise<void> {
			await requestJson(fetcher, buildUrl(baseUrl, `/categories/${id}`), {
				method: "DELETE",
				headers: await makeHeaders(getToken),
			});
		},
	};
}
