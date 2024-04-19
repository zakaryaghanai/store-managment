import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductCategoryDto } from '../../dto/create-product-category.dto';
import { ProductCategory } from '../../entity/product-category.entity';

@Injectable()
export class ProductsCategoryService {
  constructor(
    @InjectRepository(ProductCategory) private readonly productCategoryRepository: Repository<ProductCategory>,
  ) { }

  findAll() {
    return this.productCategoryRepository.find({
      relations: ["categories"]
    })
  }

  async findOne(id: number) {
    const productCategory = await this.productCategoryRepository.findOne({
      where: { id }
    })

    if (!productCategory) {
      throw new NotFoundException(`productCategory #${id} not found`)
    }

    return productCategory
  }

  async findOrCreate(name: string) {
    const productCategory = await this.productCategoryRepository.findOne({
      where: { name }
    })

    if (productCategory) {
      return productCategory;
    }

    return this.create({ name })
  }

  async create(CreateProductCategoryDto: CreateProductCategoryDto) {
    const productCategory = this.productCategoryRepository.create(CreateProductCategoryDto);

    return this.productCategoryRepository.save(productCategory);
  }

}
