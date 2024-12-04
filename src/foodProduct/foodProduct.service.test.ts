import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { EmissionFactorNotFoundException } from "../carbonEmissionFactor/carbonEmissionFactor.exception";
import { FoodProduct } from "./foodProduct.entity";
import { FoodProductService } from "./foodProduct.service";
import { FoodProductIngredient } from "./foodProductIngredient.entity";

let foodProductService: FoodProductService;
let testEmissionFactors: CarbonEmissionFactor[];

beforeAll(async () => {
  await dataSource.initialize();
  foodProductService = new FoodProductService(
    dataSource.getRepository(FoodProduct),
    dataSource.getRepository(CarbonEmissionFactor)
  );
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
  testEmissionFactors = [
    new CarbonEmissionFactor({
      name: "flour",
      unit: "kg",
      emissionCO2eInKgPerUnit: 0.5,
      source: "Agrybalise"
    }),
    new CarbonEmissionFactor({
      name: "flour",
      unit: "g",
      emissionCO2eInKgPerUnit: 0.0005,
      source: "Agrybalise"
    }),
    new CarbonEmissionFactor({
      name: "water",
      unit: "l",
      emissionCO2eInKgPerUnit: 0.2,
      source: "Agrybalise"
    })
  ];
  await dataSource.getRepository(CarbonEmissionFactor).save(testEmissionFactors);
});

describe("FoodProduct.service", () => {
  describe("calculateCarbonFootprint", () => {
    it("should calculate carbon footprint when all emission factors exist", async () => {
      const ingredients = [
        new FoodProductIngredient({
          name: "flour",
          quantity: 2,
          unit: "kg"
        })
      ];

      const result = await foodProductService.calculateCarbonFootprint(ingredients);
      expect(result).toBe(1); // 2 kg * 0.5 kg CO2e/kg
    });

    it("should handle multiple ingredients correctly", async () => {
      const ingredients = [
        new FoodProductIngredient({
          name: "flour",
          quantity: 2,
          unit: "kg"
        }),
        new FoodProductIngredient({
          name: "water",
          quantity: 1,
          unit: "l"
        })
      ];

      const result = await foodProductService.calculateCarbonFootprint(ingredients);
      expect(result).toBe(1.2); // (2 * 0.5) + (1 * 0.2)
    });

    it("should throw EmissionFactorNotFoundException when emission factor is missing", async () => {
      const ingredients = [
        new FoodProductIngredient({
          name: "unknown",
          quantity: 1,
          unit: "kg"
        })
      ];
  
      await expect(foodProductService.calculateCarbonFootprint(ingredients))
        .rejects
        .toThrow(EmissionFactorNotFoundException);
    });

    it("should handle different units for same ingredient", async () => {
      const ingredients = [
        new FoodProductIngredient({
          name: "flour",
          quantity: 1000,
          unit: "g"
        })
      ];

      const result = await foodProductService.calculateCarbonFootprint(ingredients);
      expect(result).toBe(0.5); // 1000 * 0.0005
    });

    it("should handle zero quantities correctly", async () => {
      const ingredients = [
        new FoodProductIngredient({
          name: "flour",
          quantity: 0,
          unit: "kg"
        })
      ];

      const result = await foodProductService.calculateCarbonFootprint(ingredients);
      expect(result).toBe(0);
    });
  });


  describe("create", () => {
    it("should create product with calculated carbon footprint", async () => {
      const createDTO = {
        name: "Test Product",
        ingredients: [{
          name: "flour",
          quantity: 2,
          unit: "kg"
        }]
      };

      const product = await foodProductService.create(createDTO);
      
      expect(product.name).toBe("Test Product");
      expect(product.carbonFootprint).toBe(1);
      expect(product.ingredients).toHaveLength(1);
      expect(product.ingredients[0].name).toBe("flour");
    });

    it("should throw EmissionFactorNotFoundException when creating product with missing factors", async () => {
      const createDTO = {
        name: "Test Product",
        ingredients: [{
          name: "unknown",
          quantity: 1,
          unit: "kg"
        }]
      };

      await expect(foodProductService.create(createDTO))
        .rejects
        .toThrow(EmissionFactorNotFoundException);
    });

    it("should create product with multiple ingredients", async () => {
      const createDTO = {
        name: "Test Product",
        ingredients: [
          {
            name: "flour",
            quantity: 2,
            unit: "kg"
          },
          {
            name: "water",
            quantity: 1,
            unit: "l"
          }
        ]
      };

      const product = await foodProductService.create(createDTO);
      
      expect(product.name).toBe("Test Product");
      expect(product.carbonFootprint).toBe(1.2);
      expect(product.ingredients).toHaveLength(2);
    });
  });
});

afterAll(async () => {
  await dataSource.destroy();
});