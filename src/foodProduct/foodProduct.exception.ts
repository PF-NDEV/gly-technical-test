import { DomainException } from "../common/domain.exception";

export class InvalidIngredientException extends DomainException {
  constructor(message: string) {
    super(message, 'INVALID_INGREDIENT');
  }
}