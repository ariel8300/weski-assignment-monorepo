import { Controller, Post, Get, Body, ValidationPipe } from '@nestjs/common';
import { SkiTripSearchDto } from './dto/ski-trip-search.dto';
import { Hotel } from './interfaces/hotel.interface';
import { HotelsService } from './hotels.service';

/**
 * Hotels Controller
 * 
 * This controller handles hotel search requests.
 * It provides endpoints for searching hotels using external providers.
 * 
 * Key Features:
 * - Search hotels by site, dates, and group size
 * - Aggregates results from multiple group sizes
 * - Scalable provider architecture for future expansion
 */
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}



  /**
   * POST /hotels/search/group-size
   * 
   * Searches for hotels for a specific group size only.
   * This endpoint is designed for progressive loading where the frontend
   * makes multiple requests for different group sizes and aggregates results.
   * 
   * @param searchDto - Ski trip search parameters (group_size will be used as-is)
   * @returns Array of hotels for the specific group size, sorted by price
   */
  @Post('search/group-size')
  async searchHotelsForGroupSize(
    @Body(new ValidationPipe({ transform: true })) searchDto: SkiTripSearchDto
  ): Promise<Hotel[]> {
    return this.hotelsService.searchHotelsForGroupSize(searchDto);
  }

  /**
   * GET /hotels/health
   * 
   * Returns the health status of all registered providers
   * and system statistics.
   * 
   * @returns Provider health information and system stats
   */
  @Get('health')
  async getProviderHealth() {
    return this.hotelsService.getSystemStats();
  }
} 