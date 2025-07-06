import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SkiTripSearchDto } from '../dto/ski-trip-search.dto';
import { Hotel, HotelApiResponse } from '../interfaces/hotel.interface';

@Injectable()
export class ExternalApiService {
  private readonly API_BASE_URL = 'https://gya7b1xubh.execute-api.eu-west-2.amazonaws.com/default/HotelsSimulator';

  constructor(private readonly httpService: HttpService) {}

  /**
   * Fetches hotels from the external API for a specific group size
   */
  async fetchHotels(searchDto: SkiTripSearchDto): Promise<Hotel[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<HotelApiResponse>(this.API_BASE_URL, {
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
        'Failed to fetch hotels from external provider',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Fetches hotels for multiple group sizes to provide more options
   * This addresses the limitation where the API only returns rooms for exact group size
   * Optimized to make requests in parallel for better performance
   */
  async fetchHotelsForMultipleGroupSizes(
    baseSearchDto: SkiTripSearchDto
  ): Promise<Hotel[]> {
    const allHotels: Hotel[] = [];
    const seenHotelCodes = new Set<string>();

    // Create array of promises for parallel execution
    const promises: Promise<Hotel[]>[] = [];
    for (let groupSize = baseSearchDto.group_size; groupSize <= 10; groupSize++) {
      const searchDto = {
        ...baseSearchDto,
        group_size: groupSize
      };
      
      promises.push(
        this.fetchHotels(searchDto).catch(error => {
          console.error(`Error fetching hotels for group size ${groupSize}:`, error);
          return [] as Hotel[]; // Return empty array on error
        })
      );
    }

    // Execute all requests in parallel
    const results = await Promise.all(promises);
    
    // Combine and deduplicate results
    results.forEach(hotels => {
      hotels.forEach(hotel => {
        if (!seenHotelCodes.has(hotel.HotelCode)) {
          seenHotelCodes.add(hotel.HotelCode);
          allHotels.push(hotel);
        }
      });
    });

    return allHotels;
  }
} 