import { Controller, Get, Patch, Param, Body, Post, Delete, UseGuards, Request } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('merchant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get('orders')
  getOrders(@Request() req: any) {
    const merchantId = req.user?.merchant_id;
    if (!merchantId) return [];
    return this.merchantService.getOrdersByMerchant(merchantId);
  }

  @Get('stores')
  getStores(@Request() req: any) {
    const merchantId = req.user?.merchant_id;
    if (!merchantId) return [];
    return this.merchantService.getStoresByMerchant(merchantId);
  }

  @Get('catalog/options/categories/:storeId')
  getCatalogCategories(@Request() req: any, @Param('storeId') storeId: string) {
    const merchantId = req.user?.merchant_id;
    if (!merchantId) return [];
    return this.merchantService.getCatalogCategories(merchantId, storeId);
  }

  @Get('catalog/categories/list/:storeId')
  getCatalogCategoriesAll(@Request() req: any, @Param('storeId') storeId: string) {
    const merchantId = req.user?.merchant_id;
    if (!merchantId) return [];
    return this.merchantService.getCatalogCategoriesAll(merchantId, storeId);
  }

  @Get('catalog/:storeId')
  getCatalog(@Request() req: any, @Param('storeId') storeId: string) {
    const merchantId = req.user?.merchant_id;
    if (!merchantId) return [];
    return this.merchantService.getCatalogByStore(merchantId, storeId);
  }

  @Post('catalog/categories')
  createCatalogCategory(@Request() req: any, @Body() data: any) {
    const merchantId = req.user?.merchant_id;
    if (!merchantId) throw new Error('No merchant');
    return this.merchantService.createCatalogCategory(merchantId, data);
  }

  @Patch('catalog/categories/:id')
  updateCatalogCategory(@Request() req: any, @Param('id') id: string, @Body() data: any) {
    const merchantId = req.user?.merchant_id;
    if (!merchantId) throw new Error('No merchant');
    return this.merchantService.updateCatalogCategory(merchantId, id, data);
  }

  @Delete('catalog/categories/:id')
  deleteCatalogCategory(@Request() req: any, @Param('id') id: string) {
    const merchantId = req.user?.merchant_id;
    if (!merchantId) throw new Error('No merchant');
    return this.merchantService.deleteCatalogCategory(merchantId, id);
  }

  @Post('catalog')
  createCatalogItem(@Request() req: any, @Body() data: any) {
    const merchantId = req.user?.merchant_id;
    if (!merchantId) throw new Error('No merchant');
    return this.merchantService.createCatalogItem(merchantId, data);
  }

  @Patch('catalog/:id')
  updateCatalogItem(@Request() req: any, @Param('id') id: string, @Body() data: any) {
    const merchantId = req.user?.merchant_id;
    if (!merchantId) throw new Error('No merchant');
    return this.merchantService.updateCatalogItem(merchantId, id, data);
  }

  @Delete('catalog/:id')
  deleteCatalogItem(@Request() req: any, @Param('id') id: string) {
    const merchantId = req.user?.merchant_id;
    if (!merchantId) throw new Error('No merchant');
    return this.merchantService.deleteCatalogItem(merchantId, id);
  }

  @Patch('orders/:id/status')
  updateOrderStatus(@Request() req: any, @Param('id') id: string, @Body() body: { status: string }) {
    const merchantId = req.user?.merchant_id;
    if (!merchantId) throw new Error('No merchant');
    return this.merchantService.updateOrderStatus(merchantId, id, body.status);
  }
}
