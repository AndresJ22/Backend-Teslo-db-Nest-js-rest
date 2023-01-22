import { PaginationDto } from './../common/pagination.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/entities/user.entity';
import { GetUserDecorator } from '../auth/decorators/get-user.decorator';
import { ApiTags } from '@nestjs/swagger/dist';
import { ApiResponse } from '@nestjs/swagger/dist/decorators';
import { Product } from './entities/product.entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 201, description: 'Product created successfully',type:Product })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUserDecorator() user: User) {
    return this.productsService.create(createProductDto,user);
  }

  @Get()
  findAll(@Query() paginationDto:PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
