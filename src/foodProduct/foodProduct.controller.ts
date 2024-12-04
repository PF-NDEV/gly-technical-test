import { Body, Controller, Get, Logger, NotFoundException, Param, Post, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { LoggingInterceptor } from "../common/logging.interceptor";
import { CreateFoodProductDto } from "./dto/food-product.dto";
import { FoodProduct } from "./foodProduct.entity";
import { FoodProductService } from "./foodProduct.service";

@Controller("food-products")
@UseInterceptors(LoggingInterceptor)
export class FoodProductController {
  constructor(private readonly foodProductService: FoodProductService) {}
  private readonly logger = new Logger(FoodProductController.name);

  @Post()
  async createFoodProduct(
    @Body(new ValidationPipe({ transform: true })) 
    createFoodProductDto: CreateFoodProductDto
  ): Promise<FoodProduct> {
    this.logger.log(`Creating food product: ${createFoodProductDto.name}`);
    return this.foodProductService.create(createFoodProductDto);
  }

  @Get(":id")
  async getFoodProduct(@Param("id") id: number): Promise<FoodProduct> {
    this.logger.log(`[GET] Getting food product with id: ${id}`);
    const product = await this.foodProductService.findOne(id);
    if (!product) {
      throw new NotFoundException(`Food product with id ${id} not found`);
    }
    return product;
  }
}