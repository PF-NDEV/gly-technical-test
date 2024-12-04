import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FoodProduct } from './foodProduct.entity';

@Injectable()
export class FoodProductRepository extends Repository<FoodProduct> {
  constructor(dataSource: DataSource) {
    super(FoodProduct, dataSource.createEntityManager());
  }

  async findWithIngredients(id: number): Promise<FoodProduct | null> {
    return this.createQueryBuilder('product')
      .leftJoinAndSelect('product.ingredients', 'ingredient')
      .where('product.id = :id', { id })
      .getOne();
  }

  async saveBatch(products: FoodProduct[]): Promise<FoodProduct[]> {
    return this.createQueryBuilder()
      .insert()
      .into(FoodProduct)
      .values(products)
      .execute()
      .then(() => products);
  }
}