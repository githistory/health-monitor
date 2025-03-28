import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import fetch from 'node-fetch';
import { Service } from '../models/service.model';
import { EventBusService } from './event-bus.service';
import { StateService } from './state.service';

@Injectable()
export class HealthCheckService implements OnModuleInit {
  constructor(
    private readonly eventBus: EventBusService,
    private readonly state: StateService,
  ) {}

  onModuleInit() {
    // Initial health check when the module initializes
    this.checkAllServices();
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  private async checkAllServices() {
    for (const service of this.state.getServices()) {
      await this.checkService(service);
    }
  }

  async checkService(service: Service): Promise<Service> {
    try {
      const response = await fetch(service.url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Health-Monitor/1.0',
        },
      });

      // Consider 2xx status codes as UP
      const isUp = response.status >= 200 && response.status < 300;
      
      const updatedService: Service = {
        ...service,
        status: isUp ? 'UP' : 'DOWN',
      };

      // Update the service in state
      this.state.updateService(updatedService);

      // Broadcast the status update
      this.eventBus.emitServiceUpdate(updatedService);
      
      return updatedService;
    } catch (error) {
      // If there's any error (network, DNS, etc.), mark as DOWN
      const updatedService: Service = {
        ...service,
        status: 'DOWN',
      };

      // Update the service in state
      this.state.updateService(updatedService);

      // Broadcast the status update
      this.eventBus.emitServiceUpdate(updatedService);
      
      return updatedService;
    }
  }

  setServices(services: Service[]) {
    this.state.setServices(services);
  }
} 