import { ApiProperty } from '@nestjs/swagger';
import { Hotel } from 'src/hotels/hotel.entity';
import { ServiceTemplate } from 'src/service-templates/service-template.entity';

export class SystemService {
  @ApiProperty()
  id: string;

  @ApiProperty()
  hotelId: string;

  @ApiProperty()
  serviceTemplateId: string;

  @ApiProperty({ type: () => Hotel })
  hotel: Hotel;

  @ApiProperty({ type: () => ServiceTemplate })
  systemService: ServiceTemplate;
}
