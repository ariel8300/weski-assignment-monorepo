import React from 'react';
import './hotel-results.scss';

export interface SkiHotel {
  HotelCode: string;
  HotelName: string;
  HotelDescriptiveContent: {
    Images: Array<{
      URL: string;
      MainImage?: string;
    }>;
  };
  HotelInfo: {
    Position: {
      Latitude: string;
      Longitude: string;
      Distances: Array<{
        type: string;
        distance: string;
      }>;
    };
    Rating: string;
    Beds: string;
  };
  PricesInfo: {
    AmountAfterTax: string;
    AmountBeforeTax: string;
  };
}

interface HotelResultsProps {
  hotels: SkiHotel[];
  isLoading: boolean;
  searchProgress?: {
    completed: number;
    total: number;
    currentGroupSize: number;
  } | null;
  onHotelClick?: (hotel: SkiHotel) => void;
}

const HotelResults: React.FC<HotelResultsProps> = ({ hotels, isLoading, searchProgress, onHotelClick }) => {
  if (isLoading) {
    return (
      <div className="hotel-results">
        <div className="loading">
          {searchProgress ? (
            <div className="progressive-loading">
              <div className="loading-text">
                Searching {/*group sizes {searchProgress.currentGroupSize - searchProgress.completed + 1}-{searchProgress.currentGroupSize}*/}...
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(searchProgress.completed / searchProgress.total) * 100}%` }}
                ></div>
              </div>
              <div className="progress-text">
                {searchProgress.completed} of {searchProgress.total} group sizes completed
              </div>
              {hotels.length > 0 && (
                <div className="results-so-far">
                  Found {hotels.length} hotels so far...
                </div>
              )}
            </div>
          ) : (
            <div>Loading hotels...</div>
          )}
        </div>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="hotel-results">
        <div className="no-results">No hotels found for your search criteria.</div>
      </div>
    );
  }

  const getMainImage = (images: SkiHotel['HotelDescriptiveContent']['Images']) => {
    const mainImage = images.find(img => img.MainImage === 'True');
    return mainImage?.URL || images[0]?.URL || '';
  };

  const getSkiLiftDistance = (distances: SkiHotel['HotelInfo']['Position']['Distances']) => {
    const skiLift = distances.find(d => d.type === 'ski_lift');
    return skiLift?.distance || 'N/A';
  };

  const getCityCenterDistance = (distances: SkiHotel['HotelInfo']['Position']['Distances']) => {
    const cityCenter = distances.find(d => d.type === 'city_center');
    return cityCenter?.distance || 'N/A';
  };

  return (
    <div className="hotel-results">
      <div className="results-header">
        <h2>Found {hotels.length} hotels</h2>
      </div>
      <div className="results-grid">
        {hotels.map((hotel) => (
          <div 
            key={hotel.HotelCode} 
            className="hotel-card"
            onClick={() => onHotelClick?.(hotel)}
            style={{ cursor: onHotelClick ? 'pointer' : 'default' }}
          >
            <div className="card-image">
              <img 
                src={getMainImage(hotel.HotelDescriptiveContent.Images)} 
                alt={hotel.HotelName}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
            </div>
            <div className="card-content">
              <h3 className="hotel-name">{hotel.HotelName}</h3>
              <div className="hotel-info">
                <div className="rating">
                  <span className="stars">{'★'.repeat(parseInt(hotel.HotelInfo.Rating))}</span>
                  <span className="rating-text">{hotel.HotelInfo.Rating}/5</span>
                </div>
                <div className="beds">
                  <span className="beds-icon">🛏️</span>
                  <span>{hotel.HotelInfo.Beds} beds</span>
                </div>
              </div>
              <div className="distances">
                <div className="distance-item">
                  <span className="distance-icon">⛷️</span>
                  <span>Ski lift: {getSkiLiftDistance(hotel.HotelInfo.Position.Distances)}</span>
                </div>
                <div className="distance-item">
                  <span className="distance-icon">🏙️</span>
                  <span>City center: {getCityCenterDistance(hotel.HotelInfo.Position.Distances)}</span>
                </div>
              </div>
              <div className="price">
                <span className="price-amount">€{parseFloat(hotel.PricesInfo.AmountAfterTax).toFixed(2)}</span>
                <span className="price-period">per night</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelResults; 