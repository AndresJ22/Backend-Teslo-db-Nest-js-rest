import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

     constructor(@InjectRepository(User)
     private readonly userRepository: Repository<User>,
     configService: ConfigService
     ) {
          super({
               secretOrKey: configService.get('JWT_SECRET'),
               jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
          })
     }
     async validate(payload: JwtPayload): Promise<User> {
          //console.log(payload);
          const { id } = payload;
          const user = await this.userRepository.findOneBy({ id });
        
          if (!user) {
               throw new UnauthorizedException('Token is invalid');
          }
          if (!user.isActive) {
               throw new UnauthorizedException('User is not active, talk with the admin');
          }
          return user;
     }

     
}