import { Controller, Get, Post, Body, Patch, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUserDecorator } from './decorators/get-user.decorator';
import { RawHeaderDecorator } from './decorators/raw-header.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')

  @UseGuards(AuthGuard(), UserRoleGuard)
  checkAuthStatus(
    @GetUserDecorator() user: User//  @GetUserDecorator(id) id: String
  ) {
    const userValid = this.authService.checkAuthStatus(user);
    return {
      ...userValid
    }
    }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    // @GetUserDecorator(['email','role','fullName']) user:User
    @GetUserDecorator() user: User,
    @GetUserDecorator('email') email: string,
    @RawHeaderDecorator('authorization') rawHeaders: string[],
  ) {
    // console.log({ user : request.user })
    return {
      message: "This is a private route",
      user,
      email,
      rawHeaders
    }
  }

  @Get('private2')
  //@SetMetadata('roles', ['admin'])
  @RoleProtected(ValidRoles.superUser)
  @UseGuards(AuthGuard(),UserRoleGuard)
  privateRoute2(
    @GetUserDecorator() user: User
  ) {
    return {
      message: "This is a private route",
      user
    }
  };

  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute3(
    @GetUserDecorator() user: User
  ) {
    return {
      message: "This is a private route",
      user
    }
  };
}
