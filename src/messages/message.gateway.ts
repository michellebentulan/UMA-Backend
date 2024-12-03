import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../sessions/session.entity';
import { User } from '../users/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Optional: Use if user data is needed
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    console.log('Token received during socket connection:', token);

    if (!token) {
      console.error('No token provided for socket connection');
      client.disconnect(true);
      return;
    }

    try {
      // Validate the token and fetch user information
      const session = await this.sessionRepository.findOne({
        where: { session_token: token },
        relations: ['user'],
      });

      if (!session || session.expires_at < new Date()) {
        console.error('Invalid or expired session token for socket connection');
        client.disconnect(true);
        return;
      }

      // Store the user in socket data for future use
      client.data.user = session.user;
      console.log(`User ${session.user.id} connected via socket`);
    } catch (error) {
      console.error('Socket authentication error:', error);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(client: Socket, conversationId: string | number) {
    if (!conversationId) {
      console.error('Invalid conversationId:', conversationId);
      return;
    }
    // {
    //   console.error('Invalid conversationId:', conversationId);
    //   return;
    // }

    client.join(conversationId.toString()); // Convert to string to avoid room mismatch
    console.log(
      `User ${client.data.user?.id} joined conversation room: ${conversationId}`,
    );
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: CreateMessageDto): void {
    if (!client.data.user) {
      console.error('Unauthenticated client attempted to send a message');
      return;
    }

    // Emit message to the specific room (conversation)
    this.server.to(payload.conversationId.toString()).emit('newMessage', {
      ...payload,
      senderId: client.data.user.id, // Attach sender ID to the payload
    });
  }

  @SubscribeMessage('typing')
  handleTyping(
    client: Socket,
    payload: { conversationId: string; userId: string },
  ) {
    if (!client.data.user) {
      console.error('Unauthenticated client attempted to use typing event');
      return;
    }

    this.server.to(payload.conversationId).emit('typing', payload);
  }
}
