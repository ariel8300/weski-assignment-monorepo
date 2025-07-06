import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { HotelProvider } from '../interfaces/provider.interface';
import { SkiTripSearchDto } from '../dto/ski-trip-search.dto';
import { Hotel } from '../interfaces/hotel.interface';

@Injectable()
export class ExampleSecondProvider implements HotelProvider {
  readonly providerId = 'example-second';
  readonly providerName = 'Example Second Provider';

  private readonly API_BASE_URL = 'https://api.example-second-provider.com/hotels';

  constructor(private readonly httpService: HttpService) {}

  async fetchHotels(searchDto: SkiTripSearchDto): Promise<Hotel[]> {
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
            'Authorization': 'Bearer MY_API_KEY' // this is just example
          },
          timeout: 10000,
        })
      );

      // Transform the response to match our standard Hotel interface
      const hotels = this.transformResponse(response.data);
      
      return hotels;
    } catch (error) {
      console.error(`Error fetching from ${this.providerName}:`, error);
      throw new HttpException(
        `Failed to fetch hotels from ${this.providerName}`,
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
   * Transform provider-specific response to standard Hotel format
   * This is where I'd handle different API response structures
   */
  private transformResponse(data: any): Hotel[] {
    // This is just an example - real implementation would depend on the actual API response
    return data.hotels?.map((hotel: any) => ({
      HotelCode: hotel.id,
      HotelName: hotel.name,
      HotelDescriptiveContent: {
        Images: hotel.images?.map((img: string) => ({ URL: img })) || []
      },
      HotelInfo: {
        Position: {
          Latitude: hotel.latitude?.toString() || "0",
          Longitude: hotel.longitude?.toString() || "0",
          Distances: hotel.distances || []
        },
        Rating: hotel.rating?.toString() || "0",
        Beds: hotel.beds?.toString() || "0"
      },
      PricesInfo: {
        AmountAfterTax: hotel.price?.toString() || "0",
        CurrencyCode: hotel.currency || "EUR"
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