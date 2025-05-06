import { Module } from '@nestjs/common';
import { ServiceTemplateController } from './service-template.controller';
import { ServiceTemplateService } from './service-template.service';
import { ServiceTemplateRepository } from './service-template.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceTemplateController],
  providers: [
    {
      provide: 'IServiceTemplateService',
      useClass: ServiceTemplateService,
    },
    {
      provide: 'IServiceTemplateRepository',
      useClass: ServiceTemplateRepository,
    },
  ],
  exports: ['IServiceTemplateService', 'IServiceTemplateRepository'],
})
export class ServiceTemplateModule {}
