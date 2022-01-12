import { getRepository, Like, Repository } from "typeorm";

import IProductRepository from "./IProductRepository";
import Product from "../entities/Product";
import { ProductIndexOptions } from "../../@types/QueryOptions";

class ProductRepository implements IProductRepository {
	private ormRepository: Repository<Product>;

	constructor() {
		this.ormRepository = getRepository(Product);
	}

	public async getById(id: string): Promise<Product | undefined> {
		return this.ormRepository.findOne({
			where: { id },
		});
	}

	public async getAll(
		query?: ProductIndexOptions
	): Promise<{ products: Product[]; totalProducts: number }> {
		const take = (query && query.take) || 10;
		const page = (query && query.page) || 1;
		const skip = (page - 1) * take;
		const keyword = (query && query.keyword) || "";

		const [products, totalProducts] = await this.ormRepository.findAndCount({
			where: { name: Like(`%${keyword}%`) },
			order: { name: "DESC" },
			take,
			skip,
		});

		return { products, totalProducts };
	}

	public async getAllByName(name: string): Promise<Product[]> {
		return this.ormRepository.find({
			where: { name: Like(`%${name}%`) },
		});
	}

	public async save(product: Product): Promise<Product> {
		return this.ormRepository.save(product);
	}

	public async index(
		query?: ProductIndexOptions
	): Promise<{ data: Product[]; count: number }> {
		const take = (query && query.take) || 10;
		const page = (query && query.page) || 1;
		const keyword = (query && query.keyword) || "";
		const skip = (page - 1) * take;

		const [productList, totalProducts] = await this.ormRepository.findAndCount({
			where: { name: Like(`%${keyword}%`) },
			order: { name: "DESC" },
			take,
			skip,
		});

		return {
			data: productList,
			count: totalProducts,
		};
	}

	public async create(product: Product): Promise<Product> {
		const newProduct = this.ormRepository.create(product);

		await this.save(newProduct);

		return newProduct;
	}

	public async update(
		id: string,
		product: Omit<Product, "id">
	): Promise<Product> {
		const updatedProduct = await this.save({ id, ...product });

		return updatedProduct;
	}

	public async delete(id: string): Promise<void> {
		this.ormRepository.delete(id);
	}
}

export default ProductRepository;
