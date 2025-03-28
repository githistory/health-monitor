import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateServiceDto } from '../models/service.model';
import { ServicesService } from './services.service';

@Controller('api/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {
    return await this.servicesService.create(createServiceDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.servicesService.delete(id);
  }
} 