import { Body, Controller, Get, Logger, NotFoundException, Param, Post, ValidationPipe } from "@nestjs/common";
import { CreateFoodProductDto } from "./dto/food-product.dto";
import { FoodProduct } from "./foodProduct.entity";
import { FoodProductService } from "./foodProduct.service";

@Controller("food-products")
export class FoodProductController {
  constructor(private readonly foodProductService: FoodProductService) {}

  @Post()
  async createFoodProduct(
    @Body(new ValidationPipe({ transform: true })) 
    createFoodProductDto: CreateFoodProductDto
  ): Promise<FoodProduct> {
    Logger.log(
      `[food-products] [POST] Creating food product: ${createFoodProductDto.name}`
    );
    return this.foodProductService.create(createFoodProductDto);
  }

  @Get(":id")
  async getFoodProduct(@Param("id") id: number): Promise<FoodProduct> {
    Logger.log(`[food-products] [GET] Getting food product with id: ${id}`);
    const product = await this.foodProductService.findOne(id);
    if (!product) {
      throw new NotFoundException(`Food product with id ${id} not found`);
    }
    return product;
  }
}