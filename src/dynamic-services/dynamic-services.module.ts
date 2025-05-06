import { Module } from '@nestjs/common';
import { DynamicServicesController } from './dynamic-services.controller';
import { DynamicServicesService } from './dynamic-services.service';
import { DynamicServicesRepository } from './dynamic-services.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DynamicServicesController],
  providers: [
    {
      provide: 'ISystemServiceService',
      useClass: DynamicServicesService,
    },
    {
      provide: 'ISystemServiceRepository',
      useClass: DynamicServicesRepository,
    },
  ],
  exports: ['ISystemServiceService', 'ISystemServiceRepository'],
})
export class DynamicServicesModule {}
