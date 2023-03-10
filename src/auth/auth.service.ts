import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from "bcrypt";

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  
  ) { }

  async create(createAuthDto: CreateUserDto) {
    try {
      const { password, ...userDate } = createAuthDto;
      
      const user = this.userRepository.create({
        ...userDate,
        password: await bcrypt.hash(password, 10),
      });
      await this.userRepository.save(user);
      delete user.password;
      // TODO: RETORNAR EL JWT
      return user;
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    console.log(loginUserDto)
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({ 
      where: { email },
      select: [ "email", "password","id"]
    });
   // console.log(user)
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    console.log(user.password)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Invalid credentials")
      throw new BadRequestException("Invalid credentials");
    }
    delete user.password;
    return {
      ...user,
      token: this.getJwtToken(
        {
          id: user.id,
          email: user.email
        })
    };
  }
  
  async checkAuthStatus(user: User) {
    const { products,roles,isActive,...resto } = user;
    console.log(resto)
    return {
      ...resto,
      token: this.getJwtToken(
        {
          id: user.id
        })
    };
  }

  private getJwtToken(payload: JwtPayload) {
    
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDbError(error: any):never {
    if(error.code ==='23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException("Internal Server Error");
  }

}
