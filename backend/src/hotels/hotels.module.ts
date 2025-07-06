import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { ProviderManagerService } from './services/provider-manager.service';
import { AccommodationAggregatorService } from './services/accommodation-aggregator.service';
import { PowderWhiteProvider } from './providers/powder-white-provider';

@Module({
  imports: [HttpModule],
  controllers: [HotelsController],
  providers: [
    HotelsService,
    ProviderManagerService,
    AccommodationAggregatorService,
    PowderWhiteProvider
  ],
})
export class HotelsModule implements OnModuleInit {
  constructor(
    private readonly providerManager: ProviderManagerService,
    private readonly httpService: HttpService
  ) {}

  onModuleInit() {
    // Register the Powder White provider
    this.providerManager.registerProvider(new PowderWhiteProvider(this.httpService));
  }
} 