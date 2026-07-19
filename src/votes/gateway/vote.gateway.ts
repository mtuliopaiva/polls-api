import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class VoteGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.emit('votes:connected', {
      clientId: client.id,
    });
  }

  handleDisconnect(client: Socket) {
    client.emit('votes:disconnected', {
      clientId: client.id,
    });
  }

  @SubscribeMessage('votes:join')
  joinPoll(
    @MessageBody() data: { pollUuid: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`poll:${data.pollUuid}`);
    return {
      event: 'votes:joined',
      data: {
        pollUuid: data.pollUuid,
      },
    };
  }

  @SubscribeMessage('votes:leave')
  leavePoll(
    @MessageBody() data: { pollUuid: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`poll:${data.pollUuid}`);
    return {
      event: 'votes:left',
      data: {
        pollUuid: data.pollUuid,
      },
    };
  }

  emitPollVotesUpdated(
    pollUuid: string,
    payload: {
      pollUuid: string;
      votes: Array<{
        optionUuid: string;
        total: number;
      }>;
      totalVotes: number;
    },
  ) {
    this.server.to(`poll:${pollUuid}`).emit('votes:updated', payload);
  }
}
