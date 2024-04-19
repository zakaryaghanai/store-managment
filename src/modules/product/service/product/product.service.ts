import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../../dto/create-product.dto';
import { UpdateProductDto } from '../../dto/update-product.dto';
import { Product } from '../../entity/product.entity';
import { productsPaginateConfig } from '../../pagination/products.pagination.config';
import { ProductsCategoryService } from './product-category.service';


@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private readonly productSCategoryService: ProductsCategoryService
  ) { }

  async findAll(query: PaginateQuery) {
    const { data } = await paginate<Product>(query, this.productRepository, productsPaginateConfig)
    return data
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ["categories"]
    })

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`)
    }

    return product
  }

  async create(createProductDto: CreateProductDto) {
    const categories = await Promise.all(
      createProductDto.categories.map(name => this.preloadProductCategoryByName(name)),
    );

    const product = this.productRepository.create({
      ...createProductDto,
      categories,
    });

    return this.productRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const categories =
      updateProductDto.categories &&
      (await Promise.all(
        updateProductDto.categories.map(name => this.preloadProductCategoryByName(name)),
      ));

    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
      categories,
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return this.productRepository.save(product);
  }

  delete(id: number) {
    return this.productRepository.delete(id)
  }

  preloadProductCategoryByName(name: string) {
    return this.productSCategoryService.findOrCreate(name);
  }

}
