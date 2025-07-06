import { Injectable, Logger } from '@nestjs/common';
import { ProviderManagerService } from './provider-manager.service';
import { SkiTripSearchDto } from '../dto/ski-trip-search.dto';
import { Hotel } from '../interfaces/hotel.interface';
import { ProviderResult } from '../interfaces/provider.interface';

@Injectable()
export class HotelAggregatorService {
  private readonly logger = new Logger(HotelAggregatorService.name);

  constructor(private readonly providerManager: ProviderManagerService) {}

  /**
   * Search hotels for a specific group size only
   * This method is designed for progressive loading where the frontend
   * makes multiple requests for different group sizes
   */
  async searchHotelsForGroupSize(searchDto: SkiTripSearchDto): Promise<Hotel[]> {
    const startTime = Date.now();
    this.logger.log(`Searching hotels for group size ${searchDto.group_size} only`);

    try {
      // Fetch from all providers for the specific group size
      const providerResults = await this.providerManager.fetchFromAllProviders(searchDto);
      
      // Aggregate results from all providers
      const allHotels = this.aggregateProviderResults(providerResults);
      
      // Sort by price (ascending)
      const sortedHotels = this.sortByPrice(allHotels);
      
      const totalTime = Date.now() - startTime;
      this.logger.log(`Single group size search completed: ${sortedHotels.length} hotels found in ${totalTime}ms`);
      
      return sortedHotels;
    } catch (error) {
      this.logger.error('Error in single group size hotel search:', error);
      throw error;
    }
  }



  /**
   * Aggregate results from multiple providers for a single group size
   */
  private aggregateProviderResults(providerResults: ProviderResult[]): Hotel[] {
    const allHotels: Hotel[] = [];

    providerResults.forEach(providerResult => {
      if (providerResult.success) {
        allHotels.push(...providerResult.hotels);
      }
    });

    this.logger.log(`Aggregated ${allHotels.length} hotels from ${providerResults.length} providers`);
    return allHotels;
  }

  /**
   * Aggregate results from multiple providers and group sizes, removing duplicates
   */
  private aggregateAndDeduplicate(allGroupResults: ProviderResult[][], minGroupSize: number, maxGroupSize: number): Hotel[] {
    const seenHotelCodes = new Set<string>();
    const allHotels: Hotel[] = [];

    // Process each group size result
    allGroupResults.forEach((groupResults, groupIndex) => {
      groupResults.forEach(providerResult => {
        if (providerResult.success) {
          providerResult.hotels.forEach(hotel => {
            // Check if we've already seen this hotel
            if (!seenHotelCodes.has(hotel.HotelCode)) {
              seenHotelCodes.add(hotel.HotelCode);
              allHotels.push(hotel);
            }
          });
        }
      });
    });

    this.logger.log(`Aggregated ${allHotels.length} unique hotels from ${allGroupResults.length} group sizes (${minGroupSize}-${maxGroupSize})`);
    return allHotels;
  }

  /**
   * Sort hotels by price (ascending)
   * Handles cases where price might be missing or invalid
   */
  private sortByPrice(hotels: Hotel[]): Hotel[] {
    return hotels.sort((a, b) => {
      const priceA = this.extractPrice(a.PricesInfo.AmountAfterTax);
      const priceB = this.extractPrice(b.PricesInfo.AmountAfterTax);
      
      // If both prices are valid, compare them
      if (priceA !== null && priceB !== null) {
        return priceA - priceB;
      }
      
      // If only one price is valid, prioritize the one with valid price
      if (priceA !== null && priceB === null) {
        return -1;
      }
      if (priceA === null && priceB !== null) {
        return 1;
      }
      
      // If neither price is valid, maintain original order
      return 0;
    });
  }

  /**
   * Extract numeric price from string, handling edge cases
   */
  private extractPrice(priceString: string): number | null {
    if (!priceString) return null;
    
    const numericPrice = parseFloat(priceString);
    return isNaN(numericPrice) ? null : numericPrice;
  }

  /**
   * Get search statistics for monitoring
   */
  async getSearchStats(): Promise<{
    totalProviders: number;
    providerHealth: Array<{ providerId: string; providerName: string; available: boolean }>;
  }> {
    const providers = this.providerManager.getProviders();
    const health = await this.providerManager.getProviderHealth();
    
    return {
      totalProviders: providers.length,
      providerHealth: health
    };
  }
} 