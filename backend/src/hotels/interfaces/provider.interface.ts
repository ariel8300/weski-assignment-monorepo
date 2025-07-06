import { SkiTripSearchDto } from '../dto/ski-trip-search.dto';
import { Hotel } from './hotel.interface';

export interface HotelProvider {
  /**
   * Unique identifier for the provider
   */
  readonly providerId: string;

  /**
   * Human-readable name for the provider
   */
  readonly providerName: string;

  /**
   * Fetch hotels from this provider
   * @param searchDto - Search parameters
   * @returns Promise with array of hotels
   */
  fetchHotels(searchDto: SkiTripSearchDto): Promise<Hotel[]>;

  /**
   * Check if the provider is available/healthy
   * @returns Promise with boolean indicating availability
   */
  isAvailable(): Promise<boolean>;
}

export interface ProviderResult {
  providerId: string;
  providerName: string;
  hotels: Hotel[];
  success: boolean;
  error?: string;
  responseTime?: number;
} 