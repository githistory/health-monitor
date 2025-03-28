import { Injectable } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Service } from '../models/service.model';
import { StateService } from './state.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001', // Frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/',
  transports: ['websocket', 'polling'],
})
export class EventBusService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly state: StateService) {}

  handleConnection(client: Socket) {
    this.emitAllServices(this.state.getServices());
  }

  handleDisconnect(client: Socket) {}

  emitServiceUpdate(service: Service) {
    this.server.emit('serviceUpdate', service);
  }

  emitAllServices(services: Service[]) {
    this.server.emit('services', services);
  }
} 