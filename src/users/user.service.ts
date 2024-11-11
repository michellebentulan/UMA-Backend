import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { User } from './user.entity';
import { Session } from '../sessions/session.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { LessThan } from 'typeorm';
import { Location } from 'src/location/location.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Session) // Inject Session repository
    private sessionRepository: Repository<Session>,

    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  // Step 1: Create Account
  // async createAccount(userData: Partial<User>): Promise<User> {
  //   const hashedPassword = await bcrypt.hash(userData.password, 10);
  //   const user = this.userRepository.create({
  //     ...userData,
  //     password: hashedPassword,
  //   });
  //   return this.userRepository.save(user);
  // }

  async createAccount(
    userData: Partial<User>,
  ): Promise<{ user: User; sessionToken: string }> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(user);

    // Create session token and save session after account creation
    const sessionToken = uuidv4();
    const session = this.sessionRepository.create({
      user_id: savedUser.id,
      session_token: sessionToken,
      expires_at: new Date(Date.now() + 3600 * 1000), // 1-hour session expiration
    });
    await this.sessionRepository.save(session);

    return { user: savedUser, sessionToken };
  }

  // Step 2: Complete Profile
  async completeProfile(
    userId: number,
    profileData: Partial<User>,
  ): Promise<User> {
    console.log('Attempting to update profile for user ID:', userId);

    await this.userRepository.update(userId, profileData);
    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!updatedUser) {
      console.error('User not found for ID:', userId);
      throw new NotFoundException('User not found');
    }
    console.log('Updated user profile:', updatedUser); // Log updated user details
    return updatedUser;
  }

  async updateProfileImage(userId: number, imagePath: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.profile_image = imagePath;
    return this.userRepository.save(user);
  }

  async login(phoneNumber: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { phone_number: phoneNumber },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Create session token and save session
    const sessionToken = uuidv4();
    const session = this.sessionRepository.create({
      user_id: user.id, // Explicitly set user_id here
      session_token: sessionToken,
      expires_at: new Date(Date.now() + 3600 * 1000), // 1 hour session expiration
    });

    await this.sessionRepository.save(session);

    return { message: 'Login successful', sessionToken, userId: user.id }; // Return session token
  }

  async logout(userId: number): Promise<void> {
    await this.sessionRepository.delete({ user: { id: userId } });
  }

  async isUserOnline(userId: number): Promise<boolean> {
    const activeSession = await this.sessionRepository.findOne({
      where: {
        user: { id: userId },
        expires_at: MoreThan(new Date()), // Session should still be valid
      },
    });

    return !!activeSession; // Returns true if session exists and is valid
  }

  async refreshSession(sessionToken: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { session_token: sessionToken },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    session.expires_at = new Date(Date.now() + 3600 * 1000); // Extend session by 1 hour
    return this.sessionRepository.save(session);
  }

  async deleteExpiredSessions(): Promise<void> {
    console.log('Deleting expired sessions...');
    await this.sessionRepository.delete({
      expires_at: LessThan(new Date()),
    });
    console.log('Expired sessions deleted.');
  }

  // user.service.ts
  async expireSessionInTwoMinutes(sessionToken: string): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: { session_token: sessionToken },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    session.expires_at = new Date(Date.now() + 2 * 60 * 1000); // Set to expire in 2 minutes
    await this.sessionRepository.save(session);
  }

  async getUserProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log('Fetched user profile:', user);
    return user;
  }

  async findUserLocation(userId: number): Promise<Location | null> {
    // Find the user
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find matching location
    const location = await this.locationRepository.findOne({
      where: {
        town: user.town,
        barangay: user.barangay,
      },
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return location;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find(); // Fetch all users from the database
  }
}
