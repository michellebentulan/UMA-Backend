import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('requested_listings')
export class RequestedListing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.requestedListings)
  user: User;

  @Column({
    type: 'enum',
    enum: ['cow', 'pig', 'goat', 'chicken', 'duck', 'carabao'],
  })
  type: string;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 5, scale: 2 })
  preferred_weight: number;

  @Column('decimal', { precision: 10, scale: 2 })
  preferred_price: number;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  created_at: Date;
}
