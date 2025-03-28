import { Injectable } from '@nestjs/common';
import { Service } from '../models/service.model';

@Injectable()
export class StateService {
  private services: Service[] = [];

  getServices(): Service[] {
    return this.services;
  }

  setServices(services: Service[]) {
    this.services = services;
  }

  addService(service: Service) {
    this.services.push(service);
  }

  updateService(service: Service) {
    const index = this.services.findIndex(s => s.id === service.id);
    if (index !== -1) {
      this.services[index] = service;
    }
  }
} 