import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

export const ApiProductsQuery = () => applyDecorators(
  ApiQuery(
    {
      name: 'filter.categories.name',
      description: 'product category name',
      required: false,
    }
  ),
  ApiQuery(
    {
      name: 'sortBy',
      description: 'sort by price',
      required: false,
      schema: {
        type: 'string',
        enum: ['price:ASC', 'price:DESC']
      }
    }
  )
)