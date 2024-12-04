import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarbonEmissionFactor } from '../carbonEmissionFactor/carbonEmissionFactor.entity';
import { CacheService } from '../common/cache.service';
import { FoodProductController } from './foodProduct.controller';
import { FoodProduct } from './foodProduct.entity';
import { FoodProductRepository } from './foodProduct.repository';
import { FoodProductService } from './foodProduct.service';
import { FoodProductIngredient } from './foodProductIngredient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FoodProduct,
      FoodProductIngredient,
      CarbonEmissionFactor,
    ]),
    CacheModule.register({
      isGlobal: true,
      ttl: 3600, // default cache TTL
      max: 100 // maximum number of items in cache
    }),
  ],
  providers: [FoodProductService, CacheService, FoodProductRepository],
  controllers: [FoodProductController],
})
export class FoodProductModule {}