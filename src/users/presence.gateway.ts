import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Configure this properly in production
  },
})
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // Use this to keep track of connected users
  private activeUsers: Set<number> = new Set();

  handleConnection(client: Socket) {
    // When a client connects, they should send their userId in the connection handshake
    const userId = Number(client.handshake.query.userId);
    if (userId) {
      this.activeUsers.add(userId);
      this.broadcastOnlineUsers();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    if (userId) {
      this.activeUsers.delete(userId);
      this.broadcastOnlineUsers();
    }
  }

  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: any, client: Socket) {
    // Optional: You can add other message handlers like this
    console.log('Received ping:', data);
  }

  private broadcastOnlineUsers() {
    this.server.emit('onlineUsers', Array.from(this.activeUsers));
  }
}
