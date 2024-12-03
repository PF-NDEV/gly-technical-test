import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CreateFoodProductDto } from "./dto/food-product.dto";
import { FoodProduct } from "./foodProduct.entity";
import { FoodProductIngredient } from "./foodProductIngredient.entity";

@Injectable()
export class FoodProductService {
  constructor(
    @InjectRepository(FoodProduct)
    private foodProductRepository: Repository<FoodProduct>,
    @InjectRepository(CarbonEmissionFactor)
    private carbonEmissionFactorRepository: Repository<CarbonEmissionFactor>
  ) {}

  async calculateCarbonFootprint(ingredients: FoodProductIngredient[]): Promise<number | null> {
    let totalFootprint = 0;

    for (const ingredient of ingredients) {
      const emissionFactor = await this.carbonEmissionFactorRepository.findOne({
        where: {
          name: ingredient.name,
          unit: ingredient.unit,
        },
      });

      if (!emissionFactor) {
        Logger.warn(
          `No emission factor found for ingredient ${ingredient.name} with unit ${ingredient.unit}`
        );
        return null;
      }

      totalFootprint += ingredient.quantity * emissionFactor.emissionCO2eInKgPerUnit;
    }

    return totalFootprint;
  }

  async create(createFoodProductDto: CreateFoodProductDto): Promise<FoodProduct> {
    const ingredients = createFoodProductDto.ingredients.map(
      (i) => new FoodProductIngredient(i)
    );

    const product = new FoodProduct({
      name: createFoodProductDto.name,
      ingredients: ingredients
    });

    product.carbonFootprint = await this.calculateCarbonFootprint(ingredients);
    return this.foodProductRepository.save(product);
  }

  async findOne(id: number): Promise<FoodProduct | null> {
    return this.foodProductRepository.findOne({
      where: { id },
      relations: ["ingredients"],
    });
  }
}