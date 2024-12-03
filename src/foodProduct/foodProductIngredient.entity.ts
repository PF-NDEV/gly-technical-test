import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FoodProduct } from "./foodProduct.entity";

@Entity("food_product_ingredients")
export class FoodProductIngredient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    type: "float",
    nullable: false,
  })
  quantity: number;

  @Column({
    nullable: false,
  })
  unit: string;

  @ManyToOne(() => FoodProduct, (product) => product.ingredients)
  foodProduct: FoodProduct;

  constructor(props?: { name: string; quantity: number; unit: string }) {
    super();
    if (props) {
      this.name = props.name;
      this.quantity = props.quantity;
      this.unit = props.unit;
    }
  }
}