import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AccommodationProvider } from '../interfaces/provider.interface';
import { SkiTripSearchDto } from '../dto/ski-trip-search.dto';
import { SkiAccommodation } from '../interfaces/ski-accommodation.interface';

@Injectable()
export class ExampleSecondProvider implements AccommodationProvider {
  readonly providerId = 'example-second';
  readonly providerName = 'Example Second Provider';

  private readonly API_BASE_URL = 'https://api.example-second-provider.com/accommodations';

  constructor(private readonly httpService: HttpService) {}

  async fetchAccommodations(searchDto: SkiTripSearchDto): Promise<SkiAccommodation[]> {
    try {
      // Example of how a different provider might have a different API structure
      const response = await firstValueFrom(
        this.httpService.post(this.API_BASE_URL, {
          destination: searchDto.ski_site,
          checkIn: searchDto.from_date,
          checkOut: searchDto.to_date,
          guests: searchDto.group_size
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY' // Different auth method
          },
          timeout: 10000,
        })
      );

      // Transform the response to match our standard SkiAccommodation interface
      const accommodations = this.transformResponse(response.data);
      
      return accommodations;
    } catch (error) {
      console.error(`Error fetching from ${this.providerName}:`, error);
      throw new HttpException(
        `Failed to fetch accommodations from ${this.providerName}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Simple health check
      await firstValueFrom(
        this.httpService.get(`${this.API_BASE_URL}/health`, {
          timeout: 5000
        })
      );
      return true;
    } catch (error) {
      console.error(`${this.providerName} health check failed:`, error);
      return false;
    }
  }

  /**
   * Transform provider-specific response to standard SkiAccommodation format
   * This is where you'd handle different API response structures
   */
  private transformResponse(data: any): SkiAccommodation[] {
    // This is just an example - real implementation would depend on the actual API response
    return data.accommodations?.map((acc: any) => ({
      HotelCode: acc.id,
      HotelName: acc.name,
      HotelDescriptiveContent: {
        Images: acc.images?.map((img: string) => ({ URL: img })) || []
      },
      HotelInfo: {
        Position: {
          Latitude: acc.latitude?.toString() || "0",
          Longitude: acc.longitude?.toString() || "0",
          Distances: acc.distances || []
        },
        Rating: acc.rating?.toString() || "0",
        Beds: acc.beds?.toString() || "0"
      },
      PricesInfo: {
        AmountAfterTax: acc.price?.toString() || "0",
        AmountBeforeTax: acc.priceBeforeTax?.toString() || "0"
      }
    })) || [];
  }
}

/*
 * TO ADD THIS PROVIDER:
 * 
 * 1. Add to hotels.module.ts providers array:
 *    providers: [..., ExampleSecondProvider]
 * 
 * 2. Register in onModuleInit():
 *    this.providerManager.registerProvider(new ExampleSecondProvider(this.httpService));
 * 
 * 3. The system will automatically:
 *    - Fetch from both providers in parallel
 *    - Aggregate and deduplicate results
 *    - Sort by price
 *    - Return combined results
 */ 