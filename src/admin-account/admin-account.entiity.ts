import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('admin_accounts')
export class AdminAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string; // Unique email for admin accounts

  @Column()
  address: string;

  @Column({ unique: true })
  phoneNumber: string; // Unique phone number for each admin

  @Column()
  password: string; // Ensure to hash the password during registration

  @Column({ nullable: true }) // Optional column for profile images
  profileImage: string;

  @CreateDateColumn()
  created_at: Date;
}
