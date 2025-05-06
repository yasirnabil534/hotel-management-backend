import { Module } from '@nestjs/common';
import { DynamicServicesController } from './dynamic-services.controller';
import { DynamicServicesService } from './dynamic-services.service';

@Module({
  controllers: [DynamicServicesController],
  providers: [DynamicServicesService]
})
export class DynamicServicesModule {}
