import { SkiTripSearchDto } from '../dto/ski-trip-search.dto';
import { SkiAccommodation } from './ski-accommodation.interface';

export interface AccommodationProvider {
  /**
   * Unique identifier for the provider
   */
  readonly providerId: string;

  /**
   * Human-readable name for the provider
   */
  readonly providerName: string;

  /**
   * Fetch accommodations from this provider
   * @param searchDto - Search parameters
   * @returns Promise with array of accommodations
   */
  fetchAccommodations(searchDto: SkiTripSearchDto): Promise<SkiAccommodation[]>;

  /**
   * Check if the provider is available/healthy
   * @returns Promise with boolean indicating availability
   */
  isAvailable(): Promise<boolean>;
}

export interface ProviderResult {
  providerId: string;
  providerName: string;
  accommodations: SkiAccommodation[];
  success: boolean;
  error?: string;
  responseTime?: number;
} 