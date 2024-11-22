import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { PriceSuggestionService } from './price-suggestion.service';

@Controller('price-suggestions')
export class PriceSuggestionController {
  constructor(
    private readonly priceSuggestionService: PriceSuggestionService,
  ) {}

  @Post()
  async createPriceSuggestion(
    @Body('livestock_type') livestock_type: string,
    @Body('price_per_kg') price_per_kg: number,
  ) {
    return this.priceSuggestionService.createPriceSuggestion(
      livestock_type,
      price_per_kg,
    );
  }

  @Get()
  async getAllPriceSuggestions() {
    return this.priceSuggestionService.getAllPriceSuggestions();
  }

  @Patch(':id')
  async updatePriceSuggestion(
    @Param('id') id: number,
    @Body('price_per_kg') price_per_kg: number,
  ) {
    return this.priceSuggestionService.updatePriceSuggestion(id, price_per_kg);
  }

  @Delete(':id')
  async deletePriceSuggestion(@Param('id') id: number) {
    return this.priceSuggestionService.deletePriceSuggestion(id);
  }

  @Get('/search')
  async getPriceSuggestionByType(
    @Query('livestock_type') livestockType: string,
  ) {
    return this.priceSuggestionService.getPriceSuggestionByType(livestockType);
  }
}
