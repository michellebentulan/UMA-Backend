import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceSuggestion } from './price-suggestion.entity';
import { PriceSuggestionService } from './price-suggestion.service';
import { PriceSuggestionController } from './price-suggestion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PriceSuggestion])],
  controllers: [PriceSuggestionController],
  providers: [PriceSuggestionService],
})
export class PriceSuggestionModule {}
