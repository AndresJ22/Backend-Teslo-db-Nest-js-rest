import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/interfaces';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { ApiTags } from '@nestjs/swagger/dist';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  //@Auth(ValidRoles.admin) 
  execute() {
    this.seedService.runSeed();
  }
}
