import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EventBusService } from './event-bus.service';
import { HealthCheckService } from './health-check.service';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { StateService } from './state.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [ServicesController],
  providers: [ServicesService, HealthCheckService, EventBusService, StateService],
})
export class ServicesModule {} 