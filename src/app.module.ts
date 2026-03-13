import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { OrdersModule } from './orders/orders.module';
import { CatalogModule } from './catalog/catalog.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StoresModule,
    OrdersModule,
    CatalogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
