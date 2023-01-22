import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}
  async runSeed() {
    await this.deleteTables();
    const user = await this.insertUsers();
    await this.insertNewProducts(user);
    return 'SeedService.runSeed()';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder()
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async insertUsers() { 
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach((user) => { 
      // encriptar la contraseña
      let password =  bcrypt.hashSync(user.password, 10);
      user.password = password;
      users.push(this.userRepository.create(user));
    })
    await this.userRepository.save(users);
    return users[0];
  }

  private async insertNewProducts(user:User) {
    await this.productsService.deleteAllProducts();
    const products = initialData.products;
    // for (const product of products) {
    //   await this.productsService.create(product);
    // }
    const insertPromises = [];
    products.forEach((product) => { 
      insertPromises.push(this.productsService.create(product,user));
    });
    // await Promise.all(insertPromises);
    return true;
  }
}
