import { Module } from '@nestjs/common';
import { ProductController } from './controller/product.controller';
import { ProductService } from './service/product/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { ProductCategory } from './entity/product-category.entity';
import { ProductsCategoryService } from './service/product/product-category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductCategory]),
  ],
  controllers: [
    ProductController
  ],
  providers: [ProductService, ProductsCategoryService],
})
export class ProductModule {}
