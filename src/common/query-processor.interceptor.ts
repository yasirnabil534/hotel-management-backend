import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';

@Injectable()
export class QueryProcessorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    if (request?.query) {
      const query = request.query as Record<string, unknown>;
      Object.keys(query).forEach(item => {
        const value = query[item];
        if (typeof value === 'string') {
          if (value === 'true') {
            query[item] = true;
          } else if (value === 'false') {
            query[item] = false;
          } else if (value === 'undefined') {
            query[item] = undefined;
          } else if (value === 'null') {
            query[item] = null;
          }
        }

        if (item === 'search' && !query[item]) {
          delete query[item];
        }

        if (item === 'category' && query.category === 'All') {
          delete query.category;
        }

        // Convert numeric strings to numbers, but skip ObjectId fields (ending with "Id")
        // and only convert numbers under 9 digits to avoid corrupting large IDs
        const numValue = Number(query[item]);
        if (!item.endsWith('Id') && !Number.isNaN(numValue) && String(query[item]).length < 10) {
          query[item] = numValue;
        }
      });
      request.query = query;
      (request as any).processedQuery = query;
    }

    return next.handle();
  }
}
