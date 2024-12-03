import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFoodProducts1733239035860 implements MigrationInterface {
    name = 'CreateFoodProducts1733239035860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "food_products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "carbonFootprint" double precision, CONSTRAINT "PK_3aca8796e89325904061ed18b12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "food_product_ingredients" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "quantity" double precision NOT NULL, "unit" character varying NOT NULL, "foodProductId" integer, CONSTRAINT "PK_a9aeab20ca73f7b3d25b1cfe29e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "food_product_ingredients" ADD CONSTRAINT "FK_5dbebaa10ddac175abc6a20b72e" FOREIGN KEY ("foodProductId") REFERENCES "food_products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food_product_ingredients" DROP CONSTRAINT "FK_5dbebaa10ddac175abc6a20b72e"`);
        await queryRunner.query(`DROP TABLE "food_product_ingredients"`);
        await queryRunner.query(`DROP TABLE "food_products"`);
    }

}
