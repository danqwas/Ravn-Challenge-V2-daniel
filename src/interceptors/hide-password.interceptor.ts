import { map, Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class HidePasswordInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        const { password, ...rest } = data ?? {};
        if (password) {
          return {
            ...rest,
          };
        } else {
          return data;
        }
      }),
    );
  }
}
