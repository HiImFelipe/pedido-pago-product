import { injectable, inject } from "tsyringe";
import { ICallback } from "../../@types/Proto";
import IProductRepository from "../repositories/IProductRepository";
import { IProductService } from "./IProductService";

@injectable()
export class ProductService implements IProductService {
	constructor(
		@inject("ProductRepository")
		private productRepository: IProductRepository
	) {}

	async getProduct(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		const { id } = call.request;

		const product = await this.productRepository.getById(id);

		if (!product) {
			return callback(new Error("Product not found!"), null);
		}

		return callback(null, {
			...product,
			createdAt: product.createdAt.toISOString(),
			updatedAt: product.updatedAt.toISOString(),
		});
	}

	async getAllProducts(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		const { products, totalProducts } = await this.productRepository.getAll();

		const parsedProducts = products.map((product) => ({
			...product,
			createdAt: product.createdAt.toISOString(),
			updatedAt: product.updatedAt.toISOString(),
		}));

		return callback(null, { products: parsedProducts, totalProducts });
	}

	async createProduct(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		const { name } = call.request;

		const productFound = await this.productRepository.getAllByName(name);

		if (productFound.length > 0) {
			if (productFound.length > 3) {
				return callback(new Error("Maximum subsidiaries reached"), null);
			}
			const product = await this.productRepository.save(call.request);

			console.log({ ...product, createdAt: product.createdAt.toISOString() });

			return callback(null, {
				...product,
				createdAt: product.createdAt.toISOString(),
				updatedAt: product.updatedAt.toISOString(),
				isSubsidiary: true,
			});
		}

		const product = await this.productRepository.save(call.request);

		return callback(null, {
			...product,
			createdAt: product.createdAt.toISOString(),
			updatedAt: product.updatedAt.toISOString(),
		});
	}

	async updateProduct(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		const { id, ...request } = call.request;

		const productFound = await this.productRepository.getById(id);

		if (!productFound) {
			return callback(new Error("Product not found!"), null);
		}

		// Remove itens if they are falsy values (gRPC default values)
		for (let item in request) {
			if (!request[item]) {
				delete request[item];
			}
		}

		const partialProduct = await this.productRepository.update(id, request);

		return callback(null, {
			...partialProduct,
			createdAt: partialProduct?.createdAt?.toISOString() || "",
			updatedAt: partialProduct?.updatedAt?.toISOString() || "",
		});
	}

	async deleteProduct(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		const { id } = call.request;

		const productFound = await this.productRepository.getById(id);

		if (!productFound) {
			return callback(new Error("Product not found!"), null);
		}

		await this.productRepository.delete(id);

		return callback(null, {});
	}

	async cloneProduct(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		// const { id } = call.request;

		// const productFound = await this.productRepository.getById(id);

		// if (!productFound) {
		// 	return callback(new Error("Product not found!"), null);
		// }

		// await this.productRepository.delete(id);

		return callback(null, {});
	}

	async getProductsByIds(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		try {
			const { productIds } = call.request;

			const products = await this.productRepository.getAllByIds(productIds);

			console.log(products, productIds);

			const parsedProducts = products.map((product) => ({
				...product,
				createdAt: product.createdAt.toISOString(),
				updatedAt: product.updatedAt.toISOString(),
			}));

			return callback(null, {
				products: parsedProducts,
				totalProducts: products.length,
			});
		} catch (error: any) {
			return callback(error, null);
		}
	}
}
