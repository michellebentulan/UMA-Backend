import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('livestock_listings')
export class LivestockListing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.listings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => LivestockListing, (listing) => listing.user)
  listings: LivestockListing[];

  @Column({
    type: 'enum',
    enum: ['Cow', 'Pig', 'Goat', 'Chicken', 'Duck', 'Carabao'],
  })
  type: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 5, scale: 2 })
  weight_per_kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('boolean')
  negotiable: boolean;

  @Column('text')
  description: string;

  @Column('simple-json', { nullable: true })
  images: string[]; // Array to store image URLs

  @CreateDateColumn()
  created_at: Date;
}

export default LivestockListing;
