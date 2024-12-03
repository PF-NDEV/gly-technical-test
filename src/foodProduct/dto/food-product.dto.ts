export class CreateIngredientDto {
  name: string;
  quantity: number;
  unit: string;
}

export class CreateFoodProductDto {
  name: string;
  ingredients: CreateIngredientDto[];
}