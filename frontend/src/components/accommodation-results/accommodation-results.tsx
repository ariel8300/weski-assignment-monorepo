import React from 'react';
import './accommodation-results.scss';

export interface SkiAccommodation {
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

interface AccommodationResultsProps {
  accommodations: SkiAccommodation[];
  isLoading: boolean;
  searchProgress?: {
    completed: number;
    total: number;
    currentGroupSize: number;
  } | null;
  onHotelClick?: (hotel: SkiAccommodation) => void;
}

const AccommodationResults: React.FC<AccommodationResultsProps> = ({ accommodations, isLoading, searchProgress, onHotelClick }) => {
  if (isLoading) {
    return (
      <div className="accommodation-results">
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
              {accommodations.length > 0 && (
                <div className="results-so-far">
                  Found {accommodations.length} accommodations so far...
                </div>
              )}
            </div>
          ) : (
            <div>Loading accommodations...</div>
          )}
        </div>
      </div>
    );
  }

  if (accommodations.length === 0) {
    return (
      <div className="accommodation-results">
        <div className="no-results">No accommodations found for your search criteria.</div>
      </div>
    );
  }

  const getMainImage = (images: SkiAccommodation['HotelDescriptiveContent']['Images']) => {
    const mainImage = images.find(img => img.MainImage === 'True');
    return mainImage?.URL || images[0]?.URL || '';
  };

  const getSkiLiftDistance = (distances: SkiAccommodation['HotelInfo']['Position']['Distances']) => {
    const skiLift = distances.find(d => d.type === 'ski_lift');
    return skiLift?.distance || 'N/A';
  };

  const getCityCenterDistance = (distances: SkiAccommodation['HotelInfo']['Position']['Distances']) => {
    const cityCenter = distances.find(d => d.type === 'city_center');
    return cityCenter?.distance || 'N/A';
  };

  return (
    <div className="accommodation-results">
      <div className="results-header">
        <h2>Found {accommodations.length} accommodations</h2>
      </div>
      <div className="results-grid">
        {accommodations.map((accommodation) => (
          <div 
            key={accommodation.HotelCode} 
            className="accommodation-card"
            onClick={() => onHotelClick?.(accommodation)}
            style={{ cursor: onHotelClick ? 'pointer' : 'default' }}
          >
            <div className="card-image">
              <img 
                src={getMainImage(accommodation.HotelDescriptiveContent.Images)} 
                alt={accommodation.HotelName}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
            </div>
            <div className="card-content">
              <h3 className="hotel-name">{accommodation.HotelName}</h3>
              <div className="hotel-info">
                <div className="rating">
                  <span className="stars">{'★'.repeat(parseInt(accommodation.HotelInfo.Rating))}</span>
                  <span className="rating-text">{accommodation.HotelInfo.Rating}/5</span>
                </div>
                <div className="beds">
                  <span className="beds-icon">🛏️</span>
                  <span>{accommodation.HotelInfo.Beds} beds</span>
                </div>
              </div>
              <div className="distances">
                <div className="distance-item">
                  <span className="distance-icon">⛷️</span>
                  <span>Ski lift: {getSkiLiftDistance(accommodation.HotelInfo.Position.Distances)}</span>
                </div>
                <div className="distance-item">
                  <span className="distance-icon">🏙️</span>
                  <span>City center: {getCityCenterDistance(accommodation.HotelInfo.Position.Distances)}</span>
                </div>
              </div>
              <div className="price">
                <span className="price-amount">€{parseFloat(accommodation.PricesInfo.AmountAfterTax).toFixed(2)}</span>
                <span className="price-period">per night</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccommodationResults; 