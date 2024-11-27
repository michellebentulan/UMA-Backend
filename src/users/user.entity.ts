import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Session } from 'src/sessions/session.entity';
import { LivestockListing } from 'src/livestock-listings/livestock-listing.entity';
import { RequestedListing } from '../requested-listing/requested-listing.entity';
import { Message } from 'src/messages/entities/message.entity';
import { Conversation } from 'src/conversations/entities/conversation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  first_name: string;

  @Column({ length: 50 })
  last_name: string;

  @Column({ length: 15, unique: true })
  phone_number: string;

  @Column()
  password: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ type: 'date', nullable: true })
  birthdate: Date;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
  gender: string;

  @Column({ length: 50, nullable: true })
  town: string;

  @Column({ length: 50, nullable: true })
  barangay: string;

  @Column({ length: 255, nullable: true })
  profile_image: string;

  @Column({ default: false })
  is_disabled: boolean;

  @Column({ default: false })
  is_banned: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => LivestockListing, (listing) => listing.user)
  listings: LivestockListing[];

  @OneToMany(() => RequestedListing, (listing) => listing.user)
  requestedListings: RequestedListing[];

  @ManyToMany(() => Conversation, (conversation) => conversation.participants)
  conversations: Conversation[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];
}
