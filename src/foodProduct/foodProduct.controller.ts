import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { CreateFoodProductDto } from "./dto/food-product.dto";
import { FoodProduct } from "./foodProduct.entity";
import { FoodProductService } from "./foodProduct.service";

@Controller("food-products")
export class FoodProductController {
  constructor(private readonly foodProductService: FoodProductService) {}

  @Post()
  createFoodProduct(@Body() createFoodProductDto: CreateFoodProductDto): Promise<FoodProduct> {
    Logger.log(
      `[food-products] [POST] Creating food product: ${createFoodProductDto.name}`
    );
    return this.foodProductService.create(createFoodProductDto);
  }

  @Get(":id")
  getFoodProduct(@Param("id") id: number): Promise<FoodProduct | null> {
    Logger.log(`[food-products] [GET] Getting food product with id: ${id}`);
    return this.foodProductService.findOne(id);
  }
}