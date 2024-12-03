import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
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
})
export class FoodProductModule {}