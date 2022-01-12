import TestUtil from "../utils/testUtils";
import { ProductService } from "./ProductService";
import Product from "../entities/Product";
import { ProductIndexOptions } from "../../@types/QueryOptions";

describe("ProductService", () => {
	// The intention is not to test the repository functions, but to test the service,
	// so we can mock the repository functions and test the service.

	const mockRepository = {
		getById: jest.fn<Promise<Product> | Promise<undefined>, [id: string]>(),
		getAll: jest.fn<
			Promise<{ products: Product[]; totalProducts: number }>,
			[query?: ProductIndexOptions]
		>(),
		getAllByName: jest.fn<Promise<Product[]>, [name: string]>(),
		save: jest.fn<Promise<Product>, [product: Product]>(),
		index: jest.fn<
			Promise<{ data: Product[]; count: number }>,
			[query?: ProductIndexOptions]
		>(),
		create: jest.fn<Promise<Product>, [product: Product]>(),
		update: jest.fn<
			Promise<Product>,
			[id: string, product: Omit<Product, "id">]
		>(),
		delete: jest.fn<Promise<void>, [id: string]>(),
	};

	const service = new ProductService(mockRepository);

	beforeEach(() => {
		mockRepository.getById.mockReset();
		mockRepository.getAll.mockReset();
		mockRepository.getAllByName.mockReset();
		mockRepository.save.mockReset();
		mockRepository.index.mockReset();
		mockRepository.update.mockReset();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("Find all products", () => {
		it("should list all products", async () => {
			const product = TestUtil.createAValidProduct();

			mockRepository.getAll.mockReturnValue(
				new Promise((resolve) =>
					resolve({ products: Array(2).fill(product), totalProducts: 2 })
				)
			);

			const parsedProduct = {
				...product,
				createdAt: product.createdAt.toISOString(),
				updatedAt: product.updatedAt.toISOString(),
			};

			await service.getAllProducts({}, (err, res) => {
				expect(err).toBeNull();
				expect(res.products).toHaveLength(2);
				expect(res.totalProducts).toBe(2);
				expect(res).toEqual({
					products: Array(2).fill(parsedProduct),
					totalProducts: 2,
				});
			});

			expect(mockRepository.getAll).toBeCalledTimes(1);
		});
	});

	describe("Find one product", () => {
		it("should get a single product's data", async () => {
			const product = TestUtil.createAValidProduct();

			mockRepository.getById.mockReturnValue(
				new Promise<Product>((resolve) => resolve(product))
			);
			await service.getProduct({ request: { id: 1 } }, (err, res) => {
				expect(err).toBeNull();
				expect(res).toEqual({
					...product,
					createdAt: product.createdAt.toISOString(),
					updatedAt: product.updatedAt.toISOString(),
				});
			});

			expect(mockRepository.getById).toBeCalledTimes(1);
		});

		it("should not get a single product's data (not found)", async () => {
			mockRepository.getById.mockReturnValue(
				new Promise<undefined>((resolve) => resolve(undefined))
			);
			await service.getProduct({ request: { id: 1 } }, (err, res) => {
				expect(err).toHaveProperty("message", "Product not found!");
				expect(res).toBeNull();
			});

			expect(mockRepository.getById).toBeCalledTimes(1);
		});
	});

	describe("Create a product", () => {
		it("should create a new product", async () => {
			const product = TestUtil.createAValidProduct();

			mockRepository.getAllByName.mockReturnValue(
				new Promise<Product[]>((resolve) => resolve([]))
			);
			mockRepository.save.mockReturnValue(
				new Promise((resolve) => resolve(product))
			);

			await service.createProduct({ request: { ...product } }, (err, res) => {
				expect(err).toBeNull();
				expect(res).toEqual({
					...product,
					createdAt: product.createdAt.toISOString(),
					updatedAt: product.updatedAt.toISOString(),
				});
				expect(res).toHaveProperty("isSubsidiary", false);
			});

			expect(mockRepository.getAllByName).toBeCalledTimes(1);
			expect(mockRepository.save).toBeCalledTimes(1);
		});

		it("should create a new subsidiary product", async () => {
			const product = TestUtil.createAValidProduct();

			mockRepository.getAllByName.mockReturnValue(
				new Promise<Product[]>((resolve) => resolve(Array(3).fill(product)))
			);
			mockRepository.save.mockReturnValue(
				new Promise((resolve) => resolve(product))
			);

			await service.createProduct({ request: { ...product } }, (err, res) => {
				expect(err).toBeNull();
				expect(res).toEqual({
					...product,
					createdAt: product.createdAt.toISOString(),
					updatedAt: product.updatedAt.toISOString(),
					isSubsidiary: true,
				});
				expect(res).toHaveProperty("isSubsidiary", true);
			});

			expect(mockRepository.getAllByName).toBeCalledTimes(1);
			expect(mockRepository.save).toBeCalledTimes(1);
		});

		it("should not create a new product (exceeded maximum subsidiaries)", async () => {
			const product = TestUtil.createAValidProduct();

			mockRepository.getAllByName.mockReturnValue(
				new Promise((resolve) => resolve(Array(4).fill(product)))
			);
			mockRepository.save.mockReturnValue(
				new Promise((resolve) => resolve(product))
			);

			await service.createProduct({ request: { ...product } }, (err, res) => {
				expect(err).toBeDefined();
				expect(err).toHaveProperty("message", "Maximum subsidiaries reached");
				expect(res).toBeNull();
			});

			expect(mockRepository.getAllByName).toBeCalledTimes(1);
			expect(mockRepository.save).toBeCalledTimes(0);
		});
	});

	describe("Delete an existing product", () => {
		it("should delete a product", async () => {
			const product = TestUtil.createAValidProduct();

			mockRepository.getById.mockReturnValue(
				new Promise<Product>((resolve) => resolve(product))
			);
			mockRepository.delete.mockReturnValue(
				new Promise((resolve) => resolve())
			);
			await service.deleteProduct({ request: { id: 1 } }, (err, res) => {
				expect(err).toBeNull();
				expect(res).toStrictEqual({});
			});

			expect(mockRepository.delete).toBeCalledTimes(1);
			expect(mockRepository.getById).toBeCalledTimes(1);
		});

		it("should not delete a product (not found)", async () => {
			mockRepository.getById.mockReturnValue(
				new Promise<undefined>((resolve) => resolve(undefined))
			);
			mockRepository.delete.mockReturnValue(
				new Promise((resolve) => resolve())
			);
			await service.deleteProduct({ request: { id: 1 } }, (err, res) => {
				expect(err).toHaveProperty("message", "Product not found!");
				expect(res).toBeNull();
			});

			expect(mockRepository.delete).toBeCalledTimes(0);
			expect(mockRepository.getById).toBeCalledTimes(1);
		});
	});

	describe("Update an existing product", () => {
		it("should update a product", async () => {
			const product = TestUtil.createAValidProduct();

			const dataToBeUpdated: Partial<Product> = { name: "Cleber" };

			mockRepository.getById.mockReturnValue(
				new Promise<Product>((resolve) => resolve(product))
			);
			mockRepository.update.mockReturnValue(
				new Promise((resolve) => resolve({ ...product, ...dataToBeUpdated }))
			);

			await service.updateProduct(
				{ request: { id: 1, ...dataToBeUpdated } },
				(err, res) => {
					expect(err).toBeNull();
					expect(res).toEqual({
						...product,
						...dataToBeUpdated,
						createdAt: dataToBeUpdated.createdAt
							? dataToBeUpdated.createdAt.toISOString()
							: product.createdAt.toISOString(),
						updatedAt: dataToBeUpdated.updatedAt
							? dataToBeUpdated.updatedAt.toISOString()
							: product.updatedAt.toISOString(),
					});
				}
			);

			expect(mockRepository.getById).toBeCalledTimes(1);
			expect(mockRepository.update).toBeCalledTimes(1);
		});

		it("should not update a product (product not found)", async () => {
			const dataToBeUpdated = { name: "Cleber" };

			mockRepository.getById.mockReturnValue(
				new Promise<undefined>((resolve) => resolve(undefined))
			);

			await service.updateProduct(
				{ request: { id: 1, ...dataToBeUpdated } },
				(err, res) => {
					expect(err).toHaveProperty("message", "Product not found!");
					expect(res).toBeNull();
				}
			);

			expect(mockRepository.getById).toBeCalledTimes(1);
			expect(mockRepository.update).toBeCalledTimes(0);
		});
	});
});
