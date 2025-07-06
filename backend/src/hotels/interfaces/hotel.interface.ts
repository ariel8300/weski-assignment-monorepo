export interface HotelImage {
  MainImage: string;
  URL: string;
}

export interface HotelDistance {
  type: string;
  distance: string;
}

export interface HotelPosition {
  Latitude: string;
  Longitude: string;
  Distances: HotelDistance[];
}

export interface HotelInfo {
  Position: HotelPosition;
  Rating: string;
  Beds: string;
}

export interface HotelDescriptiveContent {
  Images: HotelImage[];
}

export interface HotelPricesInfo {
  AmountAfterTax: string;
  CurrencyCode: string;
}

export interface Hotel {
  HotelCode: string;
  HotelName: string;
  HotelDescriptiveContent: HotelDescriptiveContent;
  HotelInfo: HotelInfo;
  PricesInfo: HotelPricesInfo;
}

export interface HotelApiResponse {
  statusCode: number;
  body: {
    success: string;
    accommodations: Hotel[];
  };
} 