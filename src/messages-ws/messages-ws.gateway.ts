import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
import { OnGatewayDisconnect } from './../../node_modules/@nestjs/websockets/interfaces/hooks/on-gateway-disconnect.interface.d';
import { OnGatewayConnection } from './../../node_modules/@nestjs/websockets/interfaces/hooks/on-gateway-connection.interface.d';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket, Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets/decorators/gateway-server.decorator';
import { JwtService } from '@nestjs/jwt';


@WebSocketGateway({ cors : true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) { }

  handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    console.log("Client connected: ", client.id, token);
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }
    console.log(payload)

    // client.join('room1');
    // this.wss.to('room1').emit('message-from-server', {
    //   fullName: 'Server',
    //   message: 'Hello from server',
    // });

    this.wss.emit('clients-updated', this.messagesWsService.getConnectClients());
    //console.log({conectados: this.messagesWsService.getConnectClients()})
  }

  handleDisconnect(client: Socket) {
    // console.log("Client disconnected: ", client.id);
    this.messagesWsService.removeClient(client);
  }
  
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: any): void {
    // !! emite unicamente al cliente que envio el mensaje
    // console.log(client.id, payload);
    // client.emit('message-from-server', {
    //   fullName: 'Server',
    //   message: payload.message || 'Hello from server',
    // });

    // !! Emitir a todos MENOS al cliente que envio el mensaje
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Server',
    //   message: payload.message || 'Hello from server',
    // });
  
    // !! Emitir a todos 
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullNameBySocket(client.id),
      message: payload.message || 'Hello from server',
    });
  }
}
