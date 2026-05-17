import { ApiProperty } from '@nestjs/swagger';
import { Hotel } from '../hotels/hotel.entity';
import { ServiceTemplate } from '../service-templates/service-template.entity';

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
