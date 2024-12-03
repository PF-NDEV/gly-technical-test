import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { dataSource } from "../config/dataSource";
import { AppModule } from "../src/app.module";
import { CarbonEmissionFactor } from "../src/carbonEmissionFactor/carbonEmissionFactor.entity";
import { getTestEmissionFactor } from "../src/seed-dev-data";

beforeAll(async () => {
  await dataSource.initialize();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("FoodProductController", () => {
  let app: INestApplication;
  let defaultEmissionFactors: CarbonEmissionFactor[];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Seed test emission factors
    await dataSource
      .getRepository(CarbonEmissionFactor)
      .save([
        getTestEmissionFactor("flour"),
        getTestEmissionFactor("ham"),
        getTestEmissionFactor("cheese")
      ]);

    defaultEmissionFactors = await dataSource
      .getRepository(CarbonEmissionFactor)
      .find();
  });

  it("POST /food-products - should create food product", async () => {
    const createProductDto = {
      name: "Test Pizza",
      ingredients: [
        { name: "flour", quantity: 0.7, unit: "kg" },
        { name: "ham", quantity: 0.1, unit: "kg" }
      ]
    };

    return request(app.getHttpServer())
      .post("/food-products")
      .send(createProductDto)
      .expect(201)
      .expect(({ body }) => {
        expect(body.name).toBe(createProductDto.name);
        expect(body.ingredients).toHaveLength(2);
        expect(body.carbonFootprint).toBeDefined();
        expect(body.carbonFootprint).not.toBeNull();
      });
  });

  it("POST /food-products - should return 400 for invalid input", async () => {
    const invalidProductDto = {
      name: "Test Pizza",
      ingredients: [
        { name: "flour", quantity: -1, unit: "kg" } // invalid negative quantity
      ]
    };

    return request(app.getHttpServer())
      .post("/food-products")
      .send(invalidProductDto)
      .expect(400);
  });

  it("GET /food-products/:id - should return food product", async () => {
    // First create a product
    const createProductDto = {
      name: "Test Pizza",
      ingredients: [
        { name: "flour", quantity: 0.7, unit: "kg" }
      ]
    };

    const createResponse = await request(app.getHttpServer())
      .post("/food-products")
      .send(createProductDto);

    // Then retrieve it
    return request(app.getHttpServer())
      .get(`/food-products/${createResponse.body.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.name).toBe(createProductDto.name);
        expect(body.ingredients).toHaveLength(1);
      });
  });

  it("GET /food-products/:id - should return 404 for non-existent product", () => {
    return request(app.getHttpServer())
      .get("/food-products/999")
      .expect(404);
  });
});