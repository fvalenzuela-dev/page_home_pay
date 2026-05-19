import { describe, expect, it, vi } from "vitest";

import { createCategoriesApi, normalizeCategoriesPage } from "./categoriesApi";

function makeJsonResponse(body: unknown, init: ResponseInit = {}) {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { "content-type": "application/json" },
		...init,
	});
}

describe("categoriesApi", () => {
	it("lists categories with pagination and bearer token", async () => {
		const fetcher = vi.fn().mockResolvedValue(
			makeJsonResponse({
				data: [
					{
						id: 7,
						name: "Servicios",
						color_apk: "primary",
						color_web: "info",
						icon_apk: "light",
						icon_web: "electricity",
					},
				],
				page: 2,
				limit: 10,
				total: 21,
			}),
		);
		const api = createCategoriesApi({
			baseUrl: "https://api.example.test/",
			fetcher,
			getToken: async () => "clerk-token",
		});

		const page = await api.listCategories({ page: 2, limit: 10 });

		expect(fetcher).toHaveBeenCalledWith(
			"https://api.example.test/categories?page=2&limit=10",
			expect.objectContaining({
				headers: expect.objectContaining({
					Authorization: "Bearer clerk-token",
				}),
			}),
		);
		expect(page).toEqual({
			items: [
				{
					id: 7,
					name: "Servicios",
					colorApk: "primary",
					colorWeb: "info",
					iconApk: "light",
					iconWeb: "electricity",
				},
			],
			page: 2,
			limit: 10,
			totalItems: 21,
			totalPages: 3,
		});
	});

	it("creates categories using the Swagger field names", async () => {
		const fetcher = vi.fn().mockResolvedValue(
			makeJsonResponse({
				id: 11,
				name: "Servicios",
				color_apk: "success",
				color_web: "success",
				icon_apk: "home",
				icon_web: "home",
			}),
		);
		const api = createCategoriesApi({
			baseUrl: "https://api.example.test",
			fetcher,
		});

		await api.createCategory({
			name: "Servicios",
			colorApk: "success",
			colorWeb: "success",
			iconApk: "home",
			iconWeb: "home",
		});

		expect(fetcher).toHaveBeenCalledWith(
			"https://api.example.test/categories",
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({
					name: "Servicios",
					color_apk: "success",
					color_web: "success",
					icon_apk: "home",
					icon_web: "home",
				}),
			}),
		);
	});

	it("updates categories using the Swagger field names", async () => {
		const fetcher = vi.fn().mockResolvedValue(
			makeJsonResponse({
				id: 3,
				name: "Internet",
				color_apk: "secondary",
				color_web: "primary",
				icon_apk: "phone",
				icon_web: "internet",
			}),
		);
		const api = createCategoriesApi({
			baseUrl: "https://api.example.test",
			fetcher,
		});

		await api.updateCategory(3, {
			name: "Internet",
			colorApk: "secondary",
			colorWeb: "primary",
			iconApk: "phone",
			iconWeb: "internet",
		});

		expect(fetcher).toHaveBeenCalledWith(
			"https://api.example.test/categories/3",
			expect.objectContaining({
				method: "PUT",
				body: JSON.stringify({
					name: "Internet",
					color_apk: "secondary",
					color_web: "primary",
					icon_apk: "phone",
					icon_web: "internet",
				}),
			}),
		);
	});

	it("deletes categories after confirmation", async () => {
		const fetcher = vi
			.fn()
			.mockResolvedValue(new Response(null, { status: 204 }));
		const api = createCategoriesApi({
			baseUrl: "https://api.example.test",
			fetcher,
		});

		await api.deleteCategory(9);

		expect(fetcher).toHaveBeenCalledWith(
			"https://api.example.test/categories/9",
			expect.objectContaining({ method: "DELETE" }),
		);
	});

	it("maps non-ok responses to CategoriesApiError", async () => {
		const fetcher = vi
			.fn()
			.mockResolvedValue(
				makeJsonResponse({ error: "No autorizado" }, { status: 401 }),
			);
		const api = createCategoriesApi({
			baseUrl: "https://api.example.test",
			fetcher,
		});

		await expect(api.listCategories({ page: 1, limit: 20 })).rejects.toEqual(
			expect.objectContaining({
				name: "CategoriesApiError",
				status: 401,
				message: "No autorizado",
			}),
		);
	});

	it("normalizes alternative paginated response keys defensively", () => {
		expect(
			normalizeCategoriesPage({
				categories: [{ id: 1, name: "Hogar" }],
				pagination: { page: 1, page_size: 5, total_items: 6, total_pages: 2 },
			}),
		).toEqual(
			expect.objectContaining({
				page: 1,
				limit: 5,
				totalItems: 6,
				totalPages: 2,
			}),
		);
		expect(normalizeCategoriesPage(null)).toEqual({
			items: [],
			page: 1,
			limit: 20,
			totalItems: 0,
			totalPages: 1,
		});
	});

	it("requires a configured backend base URL before making default requests", async () => {
		const originalBaseUrl = process.env.NEXT_PUBLIC_HOMEPAY_API_BASE_URL;
		delete process.env.NEXT_PUBLIC_HOMEPAY_API_BASE_URL;
		const api = createCategoriesApi();

		await expect(api.listCategories({ page: 1, limit: 20 })).rejects.toThrow(
			"Configurá NEXT_PUBLIC_HOMEPAY_API_BASE_URL",
		);

		if (originalBaseUrl === undefined) {
			delete process.env.NEXT_PUBLIC_HOMEPAY_API_BASE_URL;
		} else {
			process.env.NEXT_PUBLIC_HOMEPAY_API_BASE_URL = originalBaseUrl;
		}
	});

	it("uses fallback error messages for empty error bodies", async () => {
		const fetcher = vi
			.fn()
			.mockResolvedValue(new Response("", { status: 500 }));
		const api = createCategoriesApi({
			baseUrl: "https://api.example.test",
			fetcher,
		});

		await expect(api.deleteCategory(1)).rejects.toEqual(
			expect.objectContaining({
				message: "No pudimos completar la operación de categorías.",
				status: 500,
			}),
		);
	});
});
