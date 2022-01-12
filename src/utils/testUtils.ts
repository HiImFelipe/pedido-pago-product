import Product from "../entities/Product";

export default class TestUtil {
	static createAValidProduct(data?: Partial<Product>): Product {
		const product = new Product();
		product.name = data?.name || "Test Product";
		product.price = data?.price || 10000;
		product.thumbnail = data?.thumbnail || "example/path/to/thumbnail.png";
		product.availability = data?.availability || 1;
		product.volume = data?.volume || 300;
		product.ingredients = data?.ingredients || [
			"sulfato de potassio",
			"sulfato de calcio",
		];
		return product;
	}
}
