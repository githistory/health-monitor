import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import fetch from 'node-fetch';
import { Service, UptimeRecord } from '../models/service.model';
import { EventBusService } from './event-bus.service';
import { StateService } from './state.service';

@Injectable()
export class HealthCheckService implements OnModuleInit {
  private readonly MAX_HISTORY_LENGTH = 30; // Keep last 30 records

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
    const services = this.state.getServices();
    // Run all health checks in parallel
    await Promise.all(
      services.map(service => this.checkService(service))
    );
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

      const status = isUp ? 'UP' : 'DOWN';
      
      const updatedService: Service = {
        ...service,
        status,
        history: this.updateHistory(service.history || [], status),
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
        history: this.updateHistory(service.history || [], 'DOWN'),
      };

      // Update the service in state
      this.state.updateService(updatedService);

      // Broadcast the status update
      this.eventBus.emitServiceUpdate(updatedService);
      
      return updatedService;
    }
  }

  private updateHistory(history: UptimeRecord[], status: 'UP' | 'DOWN'): UptimeRecord[] {
    const newRecord: UptimeRecord = {
      timestamp: new Date(),
      status,
    };

    // Add new record and keep only the last MAX_HISTORY_LENGTH records
    return [...history, newRecord].slice(-this.MAX_HISTORY_LENGTH);
  }

  setServices(services: Service[]) {
    this.state.setServices(services);
  }
} 