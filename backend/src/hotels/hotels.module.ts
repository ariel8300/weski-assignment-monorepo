import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HotelsController } from './hotels.controller';
import { ExternalApiService } from './services/external-api.service';

@Module({
  imports: [HttpModule],
  controllers: [HotelsController],
  providers: [ExternalApiService],
})
export class HotelsModule {} 