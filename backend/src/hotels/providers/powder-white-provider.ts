import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AccommodationProvider } from '../interfaces/provider.interface';
import { SkiTripSearchDto } from '../dto/ski-trip-search.dto';
import { SkiAccommodation, SkiAccommodationApiResponse } from '../interfaces/ski-accommodation.interface';

@Injectable()
export class PowderWhiteProvider implements AccommodationProvider {
  readonly providerId = 'powder-white';
  readonly providerName = 'Powder White';

  private readonly API_BASE_URL = 'https://gya7b1xubh.execute-api.eu-west-2.amazonaws.com/default/HotelsSimulator';

  constructor(private readonly httpService: HttpService) {}

  async fetchAccommodations(searchDto: SkiTripSearchDto): Promise<SkiAccommodation[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<SkiAccommodationApiResponse>(this.API_BASE_URL, {
          query: searchDto
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
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
      
      console.error(`Error fetching from ${this.providerName}:`, error);
      throw new HttpException(
        `Failed to fetch accommodations from ${this.providerName}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Simple health check - try to fetch with minimal data
      const testSearchDto: SkiTripSearchDto = {
        ski_site: 1,
        from_date: '01/01/2025',
        to_date: '01/02/2025',
        group_size: 1
      };

      await this.fetchAccommodations(testSearchDto);
      return true;
    } catch (error) {
      console.error(`${this.providerName} health check failed:`, error);
      return false;
    }
  }
} 