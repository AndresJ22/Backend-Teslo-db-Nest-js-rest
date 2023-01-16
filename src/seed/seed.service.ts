import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
  ){}
  async runSeed() {
    await this.insertNewProducts();
    return 'SeedService.runSeed()';
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();
    const products = initialData.products;
    // for (const product of products) {
    //   await this.productsService.create(product);
    // }
    const insertPromises = [];
    products.forEach((product) => { 
      insertPromises.push(this.productsService.create(product));
    });
    await Promise.all(insertPromises);
    return true;
  }
}
