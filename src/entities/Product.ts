import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity("products")
class Product {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	thumbnail: string;

	@Column()
	name: string;

	@Column()
	price: number;

	@Column()
	ingredients: string[];

	@Column()
	availability: number;

	@Column()
	volume: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}

export default Product;
