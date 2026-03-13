import { Controller, Get, Param, Patch, Body, Post, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  findAll() {
    return this.storesService.findAll();
  }

  @Get('options/merchants')
  getMerchants() {
    return this.storesService.getMerchants();
  }

  @Get('options/categories')
  getCategories() {
    return this.storesService.getCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Prisma.storesUpdateInput) {
    return this.storesService.update(id, updateData);
  }

  @Post()
  create(@Body() createData: Prisma.storesUncheckedCreateInput) {
    return this.storesService.create(createData);
  }

  @Post('categories')
  createCategory(@Body() data: Prisma.business_categoriesCreateInput) {
    return this.storesService.createCategory(data);
  }

  @Post('merchants')
  createMerchant(@Body() data: any) {
    return this.storesService.createMerchant(data);
  }
}
