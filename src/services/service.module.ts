import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ServiceRepository } from './service.repository';
import { ServicesController } from './service.controller';
import { ServicesService } from './service.service';

@Module({
  imports: [PrismaModule],
  controllers: [ServicesController],
  providers: [
    ServicesService,
    {
      provide: 'IServiceService',
      useClass: ServicesService,
    },
    {
      provide: 'IServiceRepository',
      useClass: ServiceRepository,
    },
  ],
  exports: ['IServiceService', 'IServiceRepository'],
})
export class ServicesModule {}