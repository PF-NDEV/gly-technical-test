import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { FoodProductController } from "./foodProduct.controller";
import { FoodProduct } from "./foodProduct.entity";
import { FoodProductService } from "./foodProduct.service";
import { FoodProductIngredient } from "./foodProductIngredient.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FoodProduct,
      FoodProductIngredient,
      CarbonEmissionFactor,
    ]),
  ],
  providers: [FoodProductService],
  controllers: [FoodProductController],
})
export class FoodProductModule {}