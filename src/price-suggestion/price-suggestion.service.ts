import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceSuggestion } from './price-suggestion.entity';

@Injectable()
export class PriceSuggestionService {
  constructor(
    @InjectRepository(PriceSuggestion)
    private readonly priceSuggestionRepository: Repository<PriceSuggestion>,
  ) {}

  async createPriceSuggestion(
    livestock_type: string,
    price_per_kg: number,
  ): Promise<PriceSuggestion> {
    const suggestion = this.priceSuggestionRepository.create({
      livestock_type,
      price_per_kg,
    });
    return await this.priceSuggestionRepository.save(suggestion);
  }

  async getAllPriceSuggestions(): Promise<PriceSuggestion[]> {
    return await this.priceSuggestionRepository.find();
  }

  async updatePriceSuggestion(
    id: number,
    price_per_kg: number,
  ): Promise<PriceSuggestion> {
    const suggestion = await this.priceSuggestionRepository.findOneBy({ id });
    if (!suggestion) throw new Error('Price suggestion not found');
    suggestion.price_per_kg = price_per_kg;
    return await this.priceSuggestionRepository.save(suggestion);
  }

  async deletePriceSuggestion(id: number): Promise<void> {
    await this.priceSuggestionRepository.delete(id);
  }

  async getPriceSuggestionByType(livestockType: string) {
    return this.priceSuggestionRepository.findOne({
      where: { livestock_type: livestockType },
    });
  }
}
