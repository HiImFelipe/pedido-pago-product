import { ICallback } from "../../@types/Proto";

export interface IProductService {
	getProduct(call: Record<string, any>, callback: ICallback): Promise<void>;
	getAllProducts(call: Record<string, any>, callback: ICallback): Promise<void>;
	createProduct(call: Record<string, any>, callback: ICallback): Promise<void>;
	updateProduct(call: Record<string, any>, callback: ICallback): Promise<void>;
	deleteProduct(call: Record<string, any>, callback: ICallback): Promise<void>;
	cloneProduct(call: Record<string, any>, callback: ICallback): Promise<void>;
	getProductsByIds(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void>;
}
