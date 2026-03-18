import { Controller, Get, Param, Post, Body, UseGuards, Req } from '@nestjs/common';
import { RidersService } from './riders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('riders')
export class RidersController {
  constructor(private readonly ridersService: RidersService) {}

  @Get()
  findAll() {
    return this.ridersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ridersService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.ridersService.create(data);
  }

  @Post(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ridersService.updateStatus(id, body.status);
  }

  @Get('me/orders/available')
  getAvailableOrders(@Req() req: any) {
    return this.ridersService.getAvailableOrders(req.user.id);
  }

  @Get('me/orders/active')
  getMyActiveOrders(@Req() req: any) {
    return this.ridersService.getMyActiveOrders(req.user.id);
  }

  @Post('me/orders/:orderId/accept')
  acceptOrder(@Req() req: any, @Param('orderId') orderId: string) {
    return this.ridersService.acceptOrder(req.user.id, orderId);
  }

  @Post('me/orders/:orderId/reject')
  rejectOrder(
    @Req() req: any,
    @Param('orderId') orderId: string,
    @Body() body: { reason?: string },
  ) {
    return this.ridersService.rejectOrder(req.user.id, orderId, body?.reason);
  }

  @Post('me/orders/:orderId/status')
  updateMyOrderStatus(
    @Req() req: any,
    @Param('orderId') orderId: string,
    @Body() body: { status: 'picked_up' | 'on_the_way' | 'delivered' },
  ) {
    return this.ridersService.updateMyOrderStatus(req.user.id, orderId, body.status);
  }
}
