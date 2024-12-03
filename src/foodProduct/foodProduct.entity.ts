import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FoodProductIngredient } from "./foodProductIngredient.entity";

@Entity("food_products")
export class FoodProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    type: "float",
    nullable: true,
  })
  carbonFootprint: number | null;

  @OneToMany(() => FoodProductIngredient, (ingredient) => ingredient.foodProduct, {
    cascade: true,
  })
  ingredients: FoodProductIngredient[];

  constructor(props?: {
    name: string;
    ingredients?: FoodProductIngredient[];
    carbonFootprint?: number | null;
  }) {
    super();
    if (props) {
      this.name = props.name;
      if (props.ingredients) {
        this.ingredients = props.ingredients;
      }
      this.carbonFootprint = props.carbonFootprint ?? null;
    }
  }
}