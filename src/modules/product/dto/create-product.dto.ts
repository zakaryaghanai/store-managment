import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  categories: string[];

  @IsOptional()
  @IsNotEmpty()
  image: string;
}