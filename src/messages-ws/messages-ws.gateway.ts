import { OnGatewayDisconnect } from './../../node_modules/@nestjs/websockets/interfaces/hooks/on-gateway-disconnect.interface.d';
import { OnGatewayConnection } from './../../node_modules/@nestjs/websockets/interfaces/hooks/on-gateway-connection.interface.d';
import { WebSocketGateway } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors : true })
export class MessagesWsGateway  implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly messagesWsService: MessagesWsService) { }
  handleDisconnect(client: Socket) {
    console.log("Client disconnected: ", client.id);
  }
  handleConnection(client: Socket, ...args: any[]) {
    console.log("Client connected: ", client.id);
  }
}
