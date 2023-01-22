import { ExecutionContext, createParamDecorator, InternalServerErrorException } from '@nestjs/common';

export const GetUserDecorator = createParamDecorator(
     (data, ctx: ExecutionContext) => {
          const request = ctx.switchToHttp().getRequest();
          //console.log(request.user);
          const user = request.user;
          if (!user) throw new InternalServerErrorException("User not found (request)");
          return user && data ? user[data] : user;
     }
)