import { Body, Controller, Get, Logger, Post, UseInterceptors } from "@nestjs/common";
import { LoggingInterceptor } from "../common/logging.interceptor";
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "./carbonEmissionFactors.service";
import { CreateCarbonEmissionFactorDto } from "./dto/create-carbonEmissionFactor.dto";

@Controller("carbon-emission-factors")
@UseInterceptors(LoggingInterceptor)
export class CarbonEmissionFactorsController {
  constructor(
    private readonly carbonEmissionFactorService: CarbonEmissionFactorsService
  ) {}
  private readonly logger = new Logger(CarbonEmissionFactorsController.name)

  @Get()
  getCarbonEmissionFactors(): Promise<CarbonEmissionFactor[]> {
    this.logger.log(
      `[GET] CarbonEmissionFactor: getting all CarbonEmissionFactors`
    );
    return this.carbonEmissionFactorService.findAll();
  }

  @Post()
  createCarbonEmissionFactors(
    @Body() carbonEmissionFactors: CreateCarbonEmissionFactorDto[]
  ): Promise<CarbonEmissionFactor[] | null> {
    ``;
     this.logger.log(
      `[POST] CarbonEmissionFactor: ${carbonEmissionFactors} created`
    );
    return this.carbonEmissionFactorService.save(carbonEmissionFactors);
  }
}
