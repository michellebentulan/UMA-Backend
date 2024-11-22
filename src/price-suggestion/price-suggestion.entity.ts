import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('price_suggestions')
export class PriceSuggestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['cow', 'pig', 'goat', 'chicken', 'duck', 'carabao'],
  })
  livestock_type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_per_kg: number;

  @CreateDateColumn()
  created_at: Date;
}
