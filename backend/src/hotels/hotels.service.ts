import { Injectable } from '@nestjs/common';
import { SkiTripSearchDto } from './dto/ski-trip-search.dto';
import { SkiAccommodation } from './interfaces/ski-accommodation.interface';
import { AccommodationAggregatorService } from './services/accommodation-aggregator.service';

@Injectable()
export class HotelsService {
  constructor(private readonly accommodationAggregator: AccommodationAggregatorService) {}

  /**
   * Search for ski accommodations using the new provider architecture
   * This method handles multiple providers, group sizes, and result aggregation
   * 
   * @param searchDto - Ski trip search parameters
   * @returns Array of ski accommodations sorted by price
   */
  async searchSkiAccommodations(searchDto: SkiTripSearchDto): Promise<SkiAccommodation[]> {
    return this.accommodationAggregator.searchAccommodations(searchDto);
  }

  /**
   * Search for ski accommodations for a specific group size only
   * This method is designed for progressive loading where the frontend
   * makes multiple requests for different group sizes
   * 
   * @param searchDto - Ski trip search parameters (group_size will be used as-is)
   * @returns Array of ski accommodations for the specific group size, sorted by price
   */
  async searchSkiAccommodationsForGroupSize(searchDto: SkiTripSearchDto): Promise<SkiAccommodation[]> {
    return this.accommodationAggregator.searchAccommodationsForGroupSize(searchDto);
  }

  /**
   * Get system statistics and provider health
   */
  async getSystemStats() {
    return this.accommodationAggregator.getSearchStats();
  }
} 