import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../../dto/create-product.dto';
import { UpdateProductDto } from '../../dto/update-product.dto';
import { ProductCategory } from '../../entity/product-category.entity';
import { Product } from '../../entity/product.entity';
import { ProductSCategoryService } from './product-category.service';
import { ProductService } from './product.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  preload: jest.fn(),
});

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: createMockRepository(),
        },
        {
          provide: ProductSCategoryService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<MockRepository>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when product with ID exists', () => {
      it('should return the product object', async () => {
        const productId = 1;

        const expectedProduct = {
          id: productId,
          name: 'test'
        };

        productRepository.findOne.mockReturnValue(expectedProduct);

        const product = await service.findOne(productId);

        expect(product).toEqual(expectedProduct);
        expect(productRepository.findOne).toBeCalledWith({ where: { id: productId }, relations: ["categories"] });
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const productId = 1;

        productRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(productId);
          expect(false).toBeTruthy(); // we should never hit this line
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Product #${productId} not found`);
          expect(productRepository.findOne).toBeCalledWith({ where: { id: productId }, relations: ["categories"] });
        }
      });
    });
  });

  describe('create', () => {
    it('should create new product and return the created product object', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Category',
        description: 'Test Category',
        price: 10,
        categories: ['drinks']
      };

      const expectedCategories = {
        id: 1,
        name: 'drinks',
      } as ProductCategory;

      jest.spyOn(service, 'preloadProductCategoryByName').mockResolvedValue(expectedCategories);

      const expectedProduct = { id: 1, ...createProductDto, categories: [expectedCategories] };

      productRepository.create.mockReturnValueOnce(expectedProduct);
      productRepository.save.mockResolvedValueOnce(expectedProduct);

      const result = await service.create(createProductDto);

      expect(result).toEqual(expectedProduct);
      expect(productRepository.create).toHaveBeenCalledWith({
        ...createProductDto, categories: [expectedCategories]
      });
      expect(productRepository.save).toHaveBeenCalledWith(expectedProduct);
    });
  });

  describe('update', () => {
    describe('when product with the given ID exists', () => {
      it('should update the product and return the updated product object', async () => {
        const productId = 1;

        const updateProductDto: UpdateProductDto = {
          name: 'Updated category name',
          categories: ['drinks']
        };

        const expectedCategories = {
          id: 1,
          name: 'drinks',
        } as ProductCategory;

        jest.spyOn(service, 'preloadProductCategoryByName').mockResolvedValue(expectedCategories);

        const expectedProduct = { id: productId, ...updateProductDto, categories: [expectedCategories] };

        productRepository.preload.mockReturnValueOnce(expectedProduct);
        productRepository.save.mockResolvedValueOnce(expectedProduct);

        const result = await service.update(productId, updateProductDto);

        expect(result).toEqual(expectedProduct);
        expect(productRepository.preload).toHaveBeenCalledWith(expectedProduct);
        expect(productRepository.save).toHaveBeenCalledWith(expectedProduct);
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const productId = 1;

        const updateProductDto: UpdateProductDto = {
          name: 'Updated category name'
        };

        productRepository.preload.mockReturnValueOnce(undefined);

        try {
          await service.update(productId, updateProductDto);
          expect(false).toBeTruthy();
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Product #${productId} not found`);
        }
      });
    });
  });

  describe('delete', () => {
    describe('when product id exists', () => {
      it('should delete the product and return the count of affected product equal to 1', async () => {
        const productId = 1;

        const expectedResult = {
          'raw': [],
          'affected': 1
        };

        productRepository.delete.mockResolvedValueOnce(expectedResult);

        const result = await service.delete(productId);

        expect(result).toEqual(expectedResult);
        expect(result.affected).toEqual(1);
        expect(productRepository.delete).toHaveBeenCalledWith(productId);
      });
    });

    describe('otherwise', () => {
      it('should return the count of affected product equal to 0', async () => {
        const productId = 1;

        const expectedResult = {
          'raw': [],
          'affected': 0
        };

        productRepository.delete.mockResolvedValueOnce(expectedResult);

        const result = await service.delete(productId);

        expect(result).toEqual(expectedResult);
        expect(result.affected).toEqual(0);
        expect(productRepository.delete).toHaveBeenCalledWith(productId);
      });
    });
  });



});
