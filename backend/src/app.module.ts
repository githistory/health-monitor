import { Module } from '@nestjs/common';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [ServicesModule],
})
export class AppModule {} 