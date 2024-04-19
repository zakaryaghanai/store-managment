import { FilterOperator, PaginateConfig } from "nestjs-paginate";
import { Product } from "../entity/product.entity";

export const productsPaginateConfig: PaginateConfig<Product> = {
  relations: ['categories'],
  sortableColumns: ['price'],
  defaultSortBy: [['price', 'ASC']],
  filterableColumns: {
    'categories.name': [FilterOperator.IN],
  },
}