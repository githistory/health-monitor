import { Injectable, OnModuleInit } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateServiceDto, Service } from '../models/service.model';
import { EventBusService } from './event-bus.service';
import { HealthCheckService } from './health-check.service';
import { StateService } from './state.service';

@Injectable()
export class ServicesService implements OnModuleInit {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly eventBus: EventBusService,
    private readonly state: StateService,
  ) {}

  onModuleInit() {
    // Initialize health check service with current services
    this.healthCheckService.setServices(this.state.getServices());
  }

  findAll(): Service[] {
    return this.state.getServices();
  }

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const service: Service = {
      id: uuidv4(),
      ...createServiceDto,
      status: 'DOWN', // Initial status
    };
    this.state.addService(service);
    
    // Broadcast the new service immediately
    this.eventBus.emitServiceUpdate(service);
    
    // Trigger immediate health check
    const checkedService = await this.healthCheckService.checkService(service);
    
    // Update service with health check result
    this.state.updateService(checkedService);
    
    // Broadcast the updated status
    this.eventBus.emitServiceUpdate(checkedService);
    return checkedService;
  }

  updateStatus(id: string, status: 'UP' | 'DOWN'): Service | null {
    const services = this.state.getServices();
    const serviceIndex = services.findIndex(service => service.id === id);
    if (serviceIndex === -1) {
      return null;
    }

    const updatedService = {
      ...services[serviceIndex],
      status,
    };

    this.state.updateService(updatedService);

    // Broadcast the status update to all connected clients
    this.eventBus.emitServiceUpdate(updatedService);

    return updatedService;
  }

  async delete(id: string): Promise<boolean> {
    const services = this.state.getServices();
    const serviceIndex = services.findIndex(service => service.id === id);
    if (serviceIndex === -1) {
      return false;
    }

    // Remove the service from state
    const updatedServices = services.filter(service => service.id !== id);
    this.state.setServices(updatedServices);

    // Broadcast the updated services list
    this.eventBus.emitAllServices(updatedServices);

    return true;
  }
} 