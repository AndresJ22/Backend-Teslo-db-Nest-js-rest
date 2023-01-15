import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product,ProductImage } from './entities';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/pagination.dto';
import {validate as isUUid } from 'uuid';
@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>
  ) { }
  
  async create(createProductDto: CreateProductDto) {
    try {
      const { images=[],...productDetails} = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) => this.productImageRepository.create({ url: image }))
      });
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleException(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit=10, offset=0 } = paginationDto;
    const products = this.productRepository.find(
      {
        take: limit,
        skip: offset,
        relations: {
          images: true
        }
      }
    );
    return products;
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUid(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      // product = await this.productRepository.findOneBy({ slug: term })
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug',
          {
            title: term.toLowerCase(),
            slug: term.toLowerCase()
          })
        .getOne();
    }
    if (!product) {
      throw new BadRequestException(`Product with id ${term} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      images:[]
    });

    if(!product){
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return product;
  }

  private handleException(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    this.logger.error(error.message, error.stack);
    throw new InternalServerErrorException('Error creating product', error.message);
  }
}
