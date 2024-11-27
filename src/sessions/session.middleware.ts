// sessions/session.middleware.ts
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SessionService } from './session.service';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private readonly sessionService: SessionService) {}

  //   async use(req: Request, res: Response, next: NextFunction) {
  //     console.log('SessionMiddleware triggered');
  //     const authorization = req.headers['authorization'];
  //     console.log('Authorization header:', authorization);

  //     if (!authorization) {
  //       throw new UnauthorizedException('Authorization header is missing');
  //     }

  //     const token = authorization.split(' ')[1];
  //     console.log('Extracted Token:', token);
  //     console.log('Authorization header:', authorization);
  //     if (!token) {
  //       console.error('Session token missing');
  //       throw new UnauthorizedException('Session token not provided');
  //     }

  //     try {
  //       const user = await this.sessionService.validateSession(token);

  //       if (!user) {
  //         console.log('Invalid or expired session');
  //         throw new UnauthorizedException('Invalid or expired session');
  //       }

  //       req['user'] = user; // Attach the user to the request object
  //       console.log('Authenticated User:', req['user']);
  //       next();
  //     } catch (error) {
  //       console.error('Error during session validation:', error);
  //       throw new UnauthorizedException('Unauthorized request');
  //     }
  //   }

  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers['authorization'];
    if (!authorization) {
      console.error('Authorization header missing');
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authorization.split(' ')[1];
    console.log('Session token:', token);

    try {
      const user = await this.sessionService.validateSession(token);
      if (!user) {
        console.error('Invalid or expired session', token);
        throw new UnauthorizedException('Invalid or expired session');
      }

      req['user'] = user; // Attach the user to the request
      console.log('User authenticated:', user.id);
      next();
    } catch (error) {
      console.error('Session validation error:', error.message);
      throw new UnauthorizedException('Unauthorized request');
    }
  }
}
