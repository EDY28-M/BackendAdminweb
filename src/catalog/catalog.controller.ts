import { Controller, Get, Param, Patch, Body, Post, UseGuards } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  findAll() {
    return this.catalogService.findAll();
  }

  @Get('options/categories/:storeId')
  getCategories(@Param('storeId') storeId: string) {
    return this.catalogService.getCategories(storeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Prisma.catalog_itemsUpdateInput) {
    return this.catalogService.update(id, updateData);
  }

  @Post()
  create(@Body() createData: any) {
    return this.catalogService.create(createData);
  }

  @Post('categories')
  createCategory(@Body() data: any) {
    return this.catalogService.createCategory(data);
  }
}
