import React, { useState, useCallback } from 'react'
import NavBar from './components/navbar/nav-bar'
import AccommodationResults, { SkiAccommodation } from './components/accommodation-results/accommodation-results'
import HotelModal from './components/hotel-modal/hotel-modal'
import { ApiService, SearchParams } from './services/api.service'
import './App.scss'

const App: React.FC = () => {
  const [accommodations, setAccommodations] = useState<SkiAccommodation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchProgress, setSearchProgress] = useState<{
    completed: number;
    total: number;
    currentGroupSize: number;
  } | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<SkiAccommodation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to deduplicate accommodations by HotelCode
  const deduplicateAccommodations = useCallback((existing: SkiAccommodation[], newOnes: SkiAccommodation[]): SkiAccommodation[] => {
    const seenHotelCodes = new Set(existing.map(acc => acc.HotelCode));
    const uniqueNewOnes = newOnes.filter(acc => !seenHotelCodes.has(acc.HotelCode));
    return [...existing, ...uniqueNewOnes];
  }, []);

  // Helper function to sort accommodations by price
  const sortAccommodationsByPrice = useCallback((accs: SkiAccommodation[]): SkiAccommodation[] => {
    return accs.sort((a, b) => {
      const priceA = parseFloat(a.PricesInfo.AmountAfterTax) || 0;
      const priceB = parseFloat(b.PricesInfo.AmountAfterTax) || 0;
      return priceA - priceB;
    });
  }, []);

  const handleHotelClick = (hotel: SkiAccommodation) => {
    setSelectedHotel(hotel);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHotel(null);
  };

  const handleSearch = async (searchParams: SearchParams) => {
    setIsLoading(true);
    setHasSearched(true);
    setAccommodations([]);
    setSelectedHotel(null);
    setIsModalOpen(false);
    
    // Calculate the range of group sizes to search (from requested size up to 10)
    const maxGroupSize = Math.min(10, searchParams.group_size + 9);
    const totalGroupSizes = maxGroupSize - searchParams.group_size + 1;
    
    setSearchProgress({
      completed: 0,
      total: totalGroupSizes,
      currentGroupSize: searchParams.group_size
    });

    try {
      // Create promises for all group sizes
      const groupSizePromises: Promise<{ groupSize: number; accommodations: SkiAccommodation[] }>[] = [];
      
      for (let groupSize = searchParams.group_size; groupSize <= maxGroupSize; groupSize++) {
        const groupSearchParams = {
          ...searchParams,
          group_size: groupSize
        };
        
        const promise = ApiService.searchSkiAccommodationsForGroupSize(groupSearchParams)
          .then(accommodations => ({ groupSize, accommodations }))
          .catch(error => {
            console.error(`Error fetching group size ${groupSize}:`, error);
            return { groupSize, accommodations: [] };
          });
        
        groupSizePromises.push(promise);
      }

      // Process results as they come in
      let allAccommodations: SkiAccommodation[] = [];
      let completedCount = 0;

      // Use Promise.allSettled to handle all promises and process results progressively
      const results = await Promise.allSettled(groupSizePromises);
      
      results.forEach((result, index) => {
        completedCount++;
        setSearchProgress(prev => prev ? {
          ...prev,
          completed: completedCount,
          currentGroupSize: searchParams.group_size + index
        } : null);

        if (result.status === 'fulfilled') {
          const { accommodations: newAccommodations } = result.value;
          
          // Deduplicate and add new accommodations
          allAccommodations = deduplicateAccommodations(allAccommodations, newAccommodations);
          
          // Sort and update state immediately
          const sortedAccommodations = sortAccommodationsByPrice(allAccommodations);
          setAccommodations(sortedAccommodations);
        }
      });

    } catch (error) {
      console.error('Search failed:', error);
      setAccommodations([]);
    } finally {
      setIsLoading(false);
      setSearchProgress(null);
    }
  };

  return (
    <div className='app'>
      <NavBar onSearch={handleSearch} isLoading={isLoading} />
      <main className="main-content">
        {hasSearched && (
          <AccommodationResults 
            accommodations={accommodations} 
            isLoading={isLoading}
            searchProgress={searchProgress}
            onHotelClick={handleHotelClick}
          />
        )}
      </main>
      
      <HotelModal 
        hotel={selectedHotel}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}

export default App
