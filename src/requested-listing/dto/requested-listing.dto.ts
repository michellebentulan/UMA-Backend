import {
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  IsNotEmpty,
  Max,
  Min,
} from 'class-validator';

export class CreateRequestedListingDto {
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsEnum(['cow', 'pig', 'goat', 'chicken', 'duck', 'carabao'])
  type: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  preferred_weight: number;

  @IsNumber()
  preferred_price: number;

  @IsString()
  description: string;
}
