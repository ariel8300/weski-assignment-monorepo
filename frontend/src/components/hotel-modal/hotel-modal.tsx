import React from 'react';
import './hotel-modal.scss';
import { SkiAccommodation } from '../accommodation-results/accommodation-results';

interface HotelModalProps {
  hotel: SkiAccommodation | null;
  isOpen: boolean;
  onClose: () => void;
}

const HotelModal: React.FC<HotelModalProps> = ({ hotel, isOpen, onClose }) => {
  if (!isOpen || !hotel) return null;

  const getMainImage = (images: SkiAccommodation['HotelDescriptiveContent']['Images']) => {
    const mainImage = images.find(img => img.MainImage === 'True');
    return mainImage?.URL || images[0]?.URL || '';
  };

  const getAllDistances = (distances: SkiAccommodation['HotelInfo']['Position']['Distances']) => {
    return distances.map((distance, index) => (
      <div key={index} className="distance-item">
        <span className="distance-type">{distance.type.replace('_', ' ')}:</span>
        <span className="distance-value">{distance.distance}</span>
      </div>
    ));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="hotel-modal-overlay" 
      onClick={handleBackdropClick}
      onKeyDown={handleEscapeKey}
      tabIndex={-1}
    >
      <div className="hotel-modal">
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        
        <div className="modal-content">
          <div className="modal-header">
            <div className="hotel-image">
              <img 
                src={getMainImage(hotel.HotelDescriptiveContent.Images)} 
                alt={hotel.HotelName}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                }}
              />
            </div>
            <div className="hotel-basic-info">
              <h2 className="hotel-name">{hotel.HotelName}</h2>
              <div className="hotel-rating">
                <span className="stars">{'★'.repeat(parseInt(hotel.HotelInfo.Rating))}</span>
                <span className="rating-text">{hotel.HotelInfo.Rating}/5</span>
              </div>
              <div className="hotel-beds">
                <span className="beds-icon">🛏️</span>
                <span>{hotel.HotelInfo.Beds} beds</span>
              </div>
            </div>
          </div>

          <div className="modal-body">
            <div className="info-section">
              <h3>Location & Distances</h3>
              <div className="location-info">
                <div className="coordinates">
                  <span>Latitude: {hotel.HotelInfo.Position.Latitude}</span>
                  <span>Longitude: {hotel.HotelInfo.Position.Longitude}</span>
                </div>
                <div className="distances">
                  {getAllDistances(hotel.HotelInfo.Position.Distances)}
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Pricing Information</h3>
              <div className="pricing-info">
                <div className="price-item">
                  <span className="price-label">Price after tax:</span>
                  <span className="price-amount">€{parseFloat(hotel.PricesInfo.AmountAfterTax).toFixed(2)}</span>
                </div>
                <div className="price-item">
                  <span className="price-label">Price before tax:</span>
                  <span className="price-amount">€{parseFloat(hotel.PricesInfo.AmountBeforeTax).toFixed(2)}</span>
                </div>
                <div className="tax-info">
                  <span className="tax-amount">
                    Tax: €{(parseFloat(hotel.PricesInfo.AmountAfterTax) - parseFloat(hotel.PricesInfo.AmountBeforeTax)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Hotel Images</h3>
              <div className="image-gallery">
                {hotel.HotelDescriptiveContent.Images.map((image, index) => (
                  <div key={index} className="gallery-image">
                    <img 
                      src={image.URL} 
                      alt={`${hotel.HotelName} - Image ${index + 1}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/150x100?text=No+Image';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <div className="hotel-code">
              <span>Hotel Code: {hotel.HotelCode}</span>
            </div>
            <button className="book-now-btn" onClick={() => {
              alert('Booking functionality would be implemented here!');
            }}>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelModal; 