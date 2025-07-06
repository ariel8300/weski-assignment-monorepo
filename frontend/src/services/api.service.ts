import { SkiAccommodation } from '../components/accommodation-results/accommodation-results';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface SearchParams {
  ski_site: number;
  from_date: string;
  to_date: string;
  group_size: number;
}

export class ApiService {
  static async searchSkiAccommodations(searchParams: SearchParams): Promise<SkiAccommodation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/hotels/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching ski accommodations:', error);
      throw error;
    }
  }

  static async searchSkiAccommodationsForGroupSize(searchParams: SearchParams): Promise<SkiAccommodation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/hotels/search/group-size`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching ski accommodations for group size:', error);
      throw error;
    }
  }
} 