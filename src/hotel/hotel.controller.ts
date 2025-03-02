import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { IHotelService } from './hotel.interface';
import { CreateHotelDto, UpdateHotelDto } from './hotel.dto';

@Controller('hotels')
export class HotelController {
  constructor(
    @Inject('IHotelService')
    private readonly hotelService: IHotelService
  ) {}

  @Post()
  create(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelService.create(createHotelDto);
  }

  @Get()
  findAll() {
    return this.hotelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hotelService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHotelDto: UpdateHotelDto) {
    return this.hotelService.update(id, updateHotelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hotelService.remove(id);
  }
}