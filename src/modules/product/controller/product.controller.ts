import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Roles } from 'src/modules/auth/decorator/roles.decorator';
import { Role } from 'src/modules/auth/enum/role.enum';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductService } from '../service/product/product.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('products')
export class ProductController {

  constructor(private readonly productService: ProductService) { }

  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.productService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id)
  }

  @Roles(Role.Admin)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto)
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto)
  }

  @Roles(Role.Admin)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productService.delete(+id)
  }
}
