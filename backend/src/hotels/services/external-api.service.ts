import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SkiTripSearchDto } from '../dto/ski-trip-search.dto';
import { SkiAccommodation, SkiAccommodationApiResponse } from '../interfaces/ski-accommodation.interface';

@Injectable()
export class ExternalApiService {
  private readonly API_BASE_URL = 'https://gya7b1xubh.execute-api.eu-west-2.amazonaws.com/default/HotelsSimulator';

  constructor(private readonly httpService: HttpService) {}

  /**
   * Fetches accommodations from the external API for a specific group size
   */
  async fetchAccommodations(searchDto: SkiTripSearchDto): Promise<SkiAccommodation[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<SkiAccommodationApiResponse>(this.API_BASE_URL, {
          query: searchDto
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      const data = response.data;
      
      if (data.statusCode !== 200 || data.body.success !== 'true') {
        throw new HttpException(
          'External API returned an error response',
          HttpStatus.BAD_GATEWAY
        );
      }

      return data.body.accommodations || [];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      console.error('Error fetching from external API:', error);
      throw new HttpException(
        'Failed to fetch accommodations from external provider',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Fetches accommodations for multiple group sizes to provide more options
   * This addresses the limitation where the API only returns rooms for exact group size
   * Optimized to make requests in parallel for better performance
   */
  async fetchAccommodationsForMultipleGroupSizes(
    baseSearchDto: SkiTripSearchDto
  ): Promise<SkiAccommodation[]> {
    const allAccommodations: SkiAccommodation[] = [];
    const seenHotelCodes = new Set<string>();

    // Create array of promises for parallel execution
    const promises: Promise<SkiAccommodation[]>[] = [];
    for (let groupSize = baseSearchDto.group_size; groupSize <= 10; groupSize++) {
      const searchDto = {
        ...baseSearchDto,
        group_size: groupSize
      };
      
      promises.push(
        this.fetchAccommodations(searchDto).catch(error => {
          console.error(`Error fetching accommodations for group size ${groupSize}:`, error);
          return [] as SkiAccommodation[]; // Return empty array on error
        })
      );
    }

    // Execute all requests in parallel
    const results = await Promise.all(promises);
    
    // Combine and deduplicate results
    results.forEach(accommodations => {
      accommodations.forEach(acc => {
        if (!seenHotelCodes.has(acc.HotelCode)) {
          seenHotelCodes.add(acc.HotelCode);
          allAccommodations.push(acc);
        }
      });
    });

    return allAccommodations;
  }
} 