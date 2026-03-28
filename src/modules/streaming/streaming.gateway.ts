import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class StreamingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('StreamingGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected for streaming events: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('playTrack')
  handlePlayTrack(@MessageBody() data: { trackId: string; userId: string }) {
    this.logger.log(`User ${data.userId} started playing track ${data.trackId}`);
    // Simulate real-time stats update to all clients watching this track
    this.server.emit('trackStatsUpdated', {
      trackId: data.trackId,
      event: 'PLAY',
      timestamp: new Date().toISOString(),
    });

    return { event: 'playing', data: data.trackId };
  }
}
