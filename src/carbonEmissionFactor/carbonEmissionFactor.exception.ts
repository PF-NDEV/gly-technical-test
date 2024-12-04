import { DomainException } from "../common/domain.exception";

export class EmissionFactorNotFoundException extends DomainException {
  constructor(ingredientName: string, unit: string) {
    super(
      `No emission factor found for ingredient ${ingredientName} with unit ${unit}`,
      'EMISSION_FACTOR_NOT_FOUND'
    );
  }
}