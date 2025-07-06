export interface SkiAccommodationImage {
  URL: string;
  MainImage?: string;
}

export interface SkiAccommodationDistance {
  type: string;
  distance: string;
}

export interface SkiAccommodationPosition {
  Latitude: string;
  Longitude: string;
  Distances: SkiAccommodationDistance[];
}

export interface SkiAccommodationInfo {
  Position: SkiAccommodationPosition;
  Rating: string;
  Beds: string;
}

export interface SkiAccommodationDescriptiveContent {
  Images: SkiAccommodationImage[];
}

export interface SkiAccommodationPricesInfo {
  AmountAfterTax: string;
  AmountBeforeTax: string;
}

export interface SkiAccommodation {
  HotelCode: string;
  HotelName: string;
  HotelDescriptiveContent: SkiAccommodationDescriptiveContent;
  HotelInfo: SkiAccommodationInfo;
  PricesInfo: SkiAccommodationPricesInfo;
}

export interface SkiAccommodationApiResponse {
  statusCode: number;
  body: {
    success: string;
    accommodations: SkiAccommodation[];
  };
} 