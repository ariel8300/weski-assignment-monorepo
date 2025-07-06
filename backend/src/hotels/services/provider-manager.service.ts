import { Injectable, Logger } from '@nestjs/common';
import { AccommodationProvider, ProviderResult } from '../interfaces/provider.interface';
import { SkiTripSearchDto } from '../dto/ski-trip-search.dto';
import { SkiAccommodation } from '../interfaces/ski-accommodation.interface';

@Injectable()
export class ProviderManagerService {
  private readonly logger = new Logger(ProviderManagerService.name);
  private providers: AccommodationProvider[] = [];

  /**
   * Register a new provider
   */
  registerProvider(provider: AccommodationProvider): void {
    this.providers.push(provider);
    this.logger.log(`Registered provider: ${provider.providerName} (${provider.providerId})`);
  }

  /**
   * Get all registered providers
   */
  getProviders(): AccommodationProvider[] {
    return [...this.providers];
  }

  /**
   * Fetch accommodations from all providers in parallel
   * Includes performance monitoring and error handling
   */
  async fetchFromAllProviders(searchDto: SkiTripSearchDto, shouldLog: boolean = true): Promise<ProviderResult[]> {
    if (this.providers.length === 0) {
      this.logger.warn('No providers registered');
      return [];
    }

    if (shouldLog) {
      this.logger.log(`Fetching from ${this.providers.length} providers`);
    }

    // Create promises for all providers with timeout and error handling
    const providerPromises = this.providers.map(async (provider) => {
      const startTime = Date.now();
      
      try {
        const accommodations = await this.fetchFromProviderWithTimeout(provider, searchDto);
        const responseTime = Date.now() - startTime;
        
        if (shouldLog) {
          this.logger.log(`${provider.providerName} returned ${accommodations.length} accommodations in ${responseTime}ms`);
        }
        
        return {
          providerId: provider.providerId,
          providerName: provider.providerName,
          accommodations,
          success: true,
          responseTime
        } as ProviderResult;
      } catch (error) {
        const responseTime = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        this.logger.error(`${provider.providerName} failed: ${errorMessage} (${responseTime}ms)`);
        
        return {
          providerId: provider.providerId,
          providerName: provider.providerName,
          accommodations: [],
          success: false,
          error: errorMessage,
          responseTime
        } as ProviderResult;
      }
    });

    // Execute all providers in parallel
    const results = await Promise.all(providerPromises);
    
    // Log summary only if shouldLog is true
    if (shouldLog) {
      const successfulProviders = results.filter(r => r.success);
      const totalAccommodations = results.reduce((sum, r) => sum + r.accommodations.length, 0);
      
      this.logger.log(`Completed: ${successfulProviders.length}/${this.providers.length} providers successful, ${totalAccommodations} total accommodations`);
    }
    
    return results;
  }

  /**
   * Fetch from a single provider with timeout
   */
  private async fetchFromProviderWithTimeout(
    provider: AccommodationProvider, 
    searchDto: SkiTripSearchDto,
    timeoutMs: number = 15000
  ): Promise<SkiAccommodation[]> {
    return Promise.race([
      provider.fetchAccommodations(searchDto),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`Provider ${provider.providerName} timed out after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
  }

  /**
   * Get provider health status
   */
  async getProviderHealth(): Promise<Array<{ providerId: string; providerName: string; available: boolean }>> {
    const healthPromises = this.providers.map(async (provider) => {
      const available = await provider.isAvailable();
      return {
        providerId: provider.providerId,
        providerName: provider.providerName,
        available
      };
    });

    return Promise.all(healthPromises);
  }
} 