import { container } from "tsyringe";

import IProductRepository from "../repositories/IProductRepository";
import ProductRepository from "../repositories/ProductRepository";

container.registerSingleton<IProductRepository>(
	"ProductRepository",
	ProductRepository
);
