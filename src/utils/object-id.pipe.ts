import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

/**
 * Validates that a route parameter is a valid 24-character hex MongoDB ObjectId.
 * Throws 400 BadRequestException if invalid, preventing raw Prisma errors reaching the client.
 *
 * Usage: @Param('id', ObjectIdPipe) id: string
 */
@Injectable()
export class ObjectIdPipe implements PipeTransform<string, string> {
  private readonly OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

  transform(value: string): string {
    if (!this.OBJECT_ID_REGEX.test(value)) {
      throw new BadRequestException('Invalid id format — must be a 24-character hex string');
    }
    return value;
  }
}
