#!/usr/bin/env node

import "reflect-metadata";
import {
	loadPackageDefinition,
	Server,
	ServerCredentials,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { createConnection } from "typeorm";
import path from "path";

import "./DI";
import { container } from "tsyringe";
import { ProductService } from "./services/ProductService";

createConnection()
	.then(() => {
		const packageDefinition = loadSync(
			path.resolve(__dirname, "pb", "product.proto"),
			{
				keepCase: true,
				longs: String,
				enums: String,
				defaults: true,
				oneofs: true,
			}
		);

		// Reason why "any" type was used: https://github.com/grpc/grpc-node/issues/1353#issuecomment-612977724
		const productProto: any =
			loadPackageDefinition(packageDefinition).productservice;

		const productService: any = container.resolve(ProductService);

		const server = new Server();
		server.addService(productProto.ProductService.service, productService);
		server.bindAsync(
			"localhost:50052",
			ServerCredentials.createInsecure(),
			(err, port) => {
				if (err) {
					console.error(err);
					return;
				}

				server.start();
				console.log(`server running on port: ${port}`);
			}
		);
	})
	.catch((e) => console.log(e));
