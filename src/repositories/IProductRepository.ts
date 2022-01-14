import { ProductIndexOptions } from "../../@types/QueryOptions";
import Product from "../entities/Product";

export default interface IProductRepository {
	getById(id: string): Promise<Product | undefined>;
	getAll(
		query?: ProductIndexOptions
	): Promise<{ products: Product[]; totalProducts: number }>;
	getAllByIds(ids: string[]): Promise<Product[]>;
	getAllByName(name: string): Promise<Product[]>;
	save(product: Omit<Product, 'id'>): Promise<Product>;
	index(
		query?: ProductIndexOptions
	): Promise<{ data: Product[]; count: number }>;
	create(product: Product): Promise<Product>;
	update(id: string, product: Omit<Product, "id">): Promise<Product>;
	delete(id: string): Promise<void>;
}
