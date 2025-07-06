import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { SkiTripSearchDto } from './dto/ski-trip-search.dto';
import { SkiAccommodation } from './interfaces/ski-accommodation.interface';
import { ExternalApiService } from './services/external-api.service';

/**
 * Hotels Controller
 * 
 * This controller handles hotel search requests.
 * It provides endpoints for searching hotels using external providers.
 * 
 * Key Features:
 * - Search hotels by site, dates, and group size
 * - Aggregates results from multiple group sizes for more options
 * - Scalable provider architecture for future expansion
 */
@Controller('hotels')
export class HotelsController {
  constructor(private readonly externalApiService: ExternalApiService) {}

  /**
   * POST /hotels/search
   * 
   * Searches for hotels using the external API provider.
   * This endpoint accepts ski site, date range, and group size parameters
   * and returns hotels that match the criteria, including larger
   * rooms to provide more options for customers.
   * 
   * @param searchDto - Ski trip search parameters
   * @returns Array of hotels
   */
  @Post('search')
  async searchHotels(
    @Body(new ValidationPipe({ transform: true })) searchDto: SkiTripSearchDto
  ): Promise<SkiAccommodation[]> {
    console.log('Hotel search called with:', searchDto);
    return this.externalApiService.fetchAccommodationsForMultipleGroupSizes(searchDto);
  }
} 