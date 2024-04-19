import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { ProductCategory } from "./product-category.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 40, unique: true })
  name: string;

  @Column({ type: "varchar" })
  description: string;

  @Column({ type: "float" })
  price: number;

  @ManyToMany(() => ProductCategory, (category) => category.products, { cascade: true })
  @JoinTable({name: 'product_categories'})
  categories: ProductCategory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
