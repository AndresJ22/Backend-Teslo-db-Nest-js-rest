import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const RawHeaderDecorator = createParamDecorator(
     (data, ctx: ExecutionContext) => {
          const request = ctx.switchToHttp().getRequest();
          const header = request.headers;
        //  console.log( header )
          return header && data ? header[data] : header;
     }
)