import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { ProviderManagerService } from './services/provider-manager.service';
import { HotelAggregatorService } from './services/hotel-aggregator.service';
import { PowderWhiteProvider } from './providers/powder-white-provider';

@Module({
  imports: [HttpModule],
  controllers: [HotelsController],
  providers: [
    HotelsService,
    ProviderManagerService,
    HotelAggregatorService,
    PowderWhiteProvider
  ],
})
export class HotelsModule implements OnModuleInit {
  constructor(
    private readonly providerManager: ProviderManagerService,
    private readonly httpService: HttpService
  ) {}

  onModuleInit() {
    // Register the assignment's provider api
    this.providerManager.registerProvider(new PowderWhiteProvider(this.httpService));
  }
} 