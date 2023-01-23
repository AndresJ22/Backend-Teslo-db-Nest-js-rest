import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

interface ConnectedClients { 
     [id: string]: {
          socket: Socket;
          user: User;
     };
}
@Injectable()
export class MessagesWsService {
     private connectedClients: ConnectedClients = {};
     
     constructor(
          @InjectRepository(User)
          private readonly userRepository: Repository<User>,
     ) { }

     async registerClient(client: Socket, userId: string) {
          const user = await this.userRepository.findOneBy({ id: userId });
          if (!user) throw new Error("User not found");
          if (!user.isActive) throw new Error("User not active");
          this.checkUserConnection(user);
          this.connectedClients[client.id] = {
               socket: client,
               user,
          };
     }

     removeClient(client: Socket) {
          delete this.connectedClients[client.id];
     }

     getConnectClients(): string[] { 
          return Object.keys(this.connectedClients);
     }

     getUserFullNameBySocket(sockedId: string): string {
          const client = this.connectedClients[sockedId].user.fullName;
          return client;
     }

     private checkUserConnection(user: User) {
          for (const clientId of Object.keys(this.connectedClients)) {
               const connectedClient = this.connectedClients[clientId];
               if (connectedClient.user.id === user.id) {
                    connectedClient.socket.disconnect();
                    break;
               }
          }
     }
}
