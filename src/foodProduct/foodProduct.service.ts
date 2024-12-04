import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { EmissionFactorNotFoundException } from "../carbonEmissionFactor/carbonEmissionFactor.exception";
import { DomainException } from "../common/domain.exception";
import { CreateFoodProductDto } from "./dto/food-product.dto";
import { FoodProduct } from "./foodProduct.entity";
import { FoodProductIngredient } from "./foodProductIngredient.entity";

@Injectable()
export class FoodProductService {
  private readonly logger = new Logger(FoodProductService.name);

  constructor(
    @InjectRepository(FoodProduct)
    private foodProductRepository: Repository<FoodProduct>,
    @InjectRepository(CarbonEmissionFactor)
    private carbonEmissionFactorRepository: Repository<CarbonEmissionFactor>
  ) {}

  async calculateCarbonFootprint(ingredients: FoodProductIngredient[]): Promise<number> {
    this.logger.debug(`Calculating carbon footprint for ${ingredients.length} ingredients`);
    let totalFootprint = 0;

    for (const ingredient of ingredients) {
      this.logger.debug(`Looking up emission factor for ${ingredient.name} (${ingredient.quantity} ${ingredient.unit})`);
      
      const emissionFactor = await this.carbonEmissionFactorRepository.findOne({
        where: {
          name: ingredient.name,
          unit: ingredient.unit,
        },
      });

      if (!emissionFactor) {
        this.logger.warn(
          `No emission factor found for ingredient ${ingredient.name} with unit ${ingredient.unit}`
        );
        throw new EmissionFactorNotFoundException(ingredient.name, ingredient.unit);
      }

      const ingredientFootprint = ingredient.quantity * emissionFactor.emissionCO2eInKgPerUnit;
      this.logger.debug(`Carbon footprint for ${ingredient.name}: ${ingredientFootprint}`);
      
      totalFootprint += ingredientFootprint;
    }

    this.logger.log(`Total carbon footprint calculated: ${totalFootprint}`);
    return totalFootprint;
  }

  async create(createFoodProductDto: CreateFoodProductDto): Promise<FoodProduct> {
    try {
      const ingredients = createFoodProductDto.ingredients.map(
        i => new FoodProductIngredient(i)
      );

      const product = new FoodProduct({
        name: createFoodProductDto.name,
        ingredients: ingredients
      });

      product.carbonFootprint = await this.calculateCarbonFootprint(ingredients);
      return this.foodProductRepository.save(product);
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }
      this.logger.error('Error creating food product', error);
      throw new Error('Failed to create food product');
    }
  }

  async findOne(id: number): Promise<FoodProduct | null> {
    return this.foodProductRepository.findOne({
      where: { id },
      relations: ["ingredients"],
    });
  }
}