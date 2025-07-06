import { Injectable } from '@nestjs/common';
import { SkiTripSearchDto } from './dto/ski-trip-search.dto';
import { Hotel } from './interfaces/hotel.interface';
import { HotelAggregatorService } from './services/hotel-aggregator.service';

@Injectable()
export class HotelsService {
  constructor(private readonly hotelAggregator: HotelAggregatorService) {}

  /**
   * Search for hotels for a specific group size only
   * This method is designed for progressive loading where the frontend
   * makes multiple requests for different group sizes
   * 
   * @param searchDto - Ski trip search parameters (group_size will be used as-is)
   * @returns Array of hotels for the specific group size, sorted by price
   */
  async searchHotelsForGroupSize(searchDto: SkiTripSearchDto): Promise<Hotel[]> {
    return this.hotelAggregator.searchHotelsForGroupSize(searchDto);
  }

  /**
   * Get system statistics and provider health
   */
  async getSystemStats() {
    return this.hotelAggregator.getSearchStats();
  }
} 