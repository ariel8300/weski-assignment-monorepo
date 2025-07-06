import { Injectable, Logger } from '@nestjs/common';
import { ProviderManagerService } from './provider-manager.service';
import { SkiTripSearchDto } from '../dto/ski-trip-search.dto';
import { SkiAccommodation } from '../interfaces/ski-accommodation.interface';
import { ProviderResult } from '../interfaces/provider.interface';

@Injectable()
export class AccommodationAggregatorService {
  private readonly logger = new Logger(AccommodationAggregatorService.name);

  constructor(private readonly providerManager: ProviderManagerService) {}

  /**
   * Search accommodations for a specific group size only
   * This method is designed for progressive loading where the frontend
   * makes multiple requests for different group sizes
   */
  async searchAccommodationsForGroupSize(searchDto: SkiTripSearchDto): Promise<SkiAccommodation[]> {
    const startTime = Date.now();
    this.logger.log(`Searching accommodations for group size ${searchDto.group_size} only`);

    try {
      // Fetch from all providers for the specific group size
      const providerResults = await this.providerManager.fetchFromAllProviders(searchDto);
      
      // Aggregate results from all providers
      const allAccommodations = this.aggregateProviderResults(providerResults);
      
      // Sort by price (ascending)
      const sortedAccommodations = this.sortByPrice(allAccommodations);
      
      const totalTime = Date.now() - startTime;
      this.logger.log(`Single group size search completed: ${sortedAccommodations.length} accommodations found in ${totalTime}ms`);
      
      return sortedAccommodations;
    } catch (error) {
      this.logger.error('Error in single group size accommodation search:', error);
      throw error;
    }
  }

  /**
   * Search accommodations with multiple group sizes and aggregate results
   * This addresses the limitation where providers only return rooms for exact group size
   */
  async searchAccommodations(searchDto: SkiTripSearchDto): Promise<SkiAccommodation[]> {
    const startTime = Date.now();
    const maxGroupSize = Math.min(10, searchDto.group_size + 9); // Limit to 10 iterations max
    this.logger.log(`Starting accommodation search for group sizes ${searchDto.group_size}-${maxGroupSize}`);

    try {
      // Fetch for the requested group size and larger sizes up to 10
      const groupSizePromises: Promise<ProviderResult[]>[] = [];
      for (let groupSize = searchDto.group_size; groupSize <= maxGroupSize; groupSize++) {
        const groupSearchDto = {
          ...searchDto,
          group_size: groupSize
        };
        
        groupSizePromises.push(
          this.providerManager.fetchFromAllProviders(groupSearchDto, groupSize === searchDto.group_size) // Only log for first request
            .catch(error => {
              this.logger.error(`Error fetching group size ${groupSize}:`, error);
              return [] as ProviderResult[];
            })
        );
      }

      // Execute all group size requests in parallel
      const allGroupResults = await Promise.all(groupSizePromises);
      
      // Flatten and aggregate all results
      const allAccommodations = this.aggregateAndDeduplicate(allGroupResults, searchDto.group_size, maxGroupSize);
      
      // Sort by price (ascending)
      const sortedAccommodations = this.sortByPrice(allAccommodations);
      
      const totalTime = Date.now() - startTime;
      this.logger.log(`Search completed: ${sortedAccommodations.length} accommodations found in ${totalTime}ms`);
      
      return sortedAccommodations;
    } catch (error) {
      this.logger.error('Error in accommodation search:', error);
      throw error;
    }
  }

  /**
   * Aggregate results from multiple providers for a single group size
   */
  private aggregateProviderResults(providerResults: ProviderResult[]): SkiAccommodation[] {
    const allAccommodations: SkiAccommodation[] = [];

    providerResults.forEach(providerResult => {
      if (providerResult.success) {
        allAccommodations.push(...providerResult.accommodations);
      }
    });

    this.logger.log(`Aggregated ${allAccommodations.length} accommodations from ${providerResults.length} providers`);
    return allAccommodations;
  }

  /**
   * Aggregate results from multiple providers and group sizes, removing duplicates
   */
  private aggregateAndDeduplicate(allGroupResults: ProviderResult[][], minGroupSize: number, maxGroupSize: number): SkiAccommodation[] {
    const seenHotelCodes = new Set<string>();
    const allAccommodations: SkiAccommodation[] = [];

    // Process each group size result
    allGroupResults.forEach((groupResults, groupIndex) => {
      groupResults.forEach(providerResult => {
        if (providerResult.success) {
          providerResult.accommodations.forEach(accommodation => {
            // Check if we've already seen this hotel
            if (!seenHotelCodes.has(accommodation.HotelCode)) {
              seenHotelCodes.add(accommodation.HotelCode);
              allAccommodations.push(accommodation);
            }
          });
        }
      });
    });

    this.logger.log(`Aggregated ${allAccommodations.length} unique accommodations from ${allGroupResults.length} group sizes (${minGroupSize}-${maxGroupSize})`);
    return allAccommodations;
  }

  /**
   * Sort accommodations by price (ascending)
   * Handles cases where price might be missing or invalid
   */
  private sortByPrice(accommodations: SkiAccommodation[]): SkiAccommodation[] {
    return accommodations.sort((a, b) => {
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