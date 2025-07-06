import React, { useState, useCallback } from 'react'
import NavBar from './components/navbar/nav-bar'
import HotelResults, { SkiHotel } from './components/hotel-results/hotel-results'
import HotelModal from './components/hotel-modal/hotel-modal'
import { ApiService, SearchParams } from './services/api.service'
import './App.scss'

const App: React.FC = () => {
  const [hotels, setHotels] = useState<SkiHotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchProgress, setSearchProgress] = useState<{
    completed: number;
    total: number;
    currentGroupSize: number;
  } | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<SkiHotel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to deduplicate hotels by HotelCode
  const deduplicateHotels = useCallback((existing: SkiHotel[], newOnes: SkiHotel[]): SkiHotel[] => {
    const seenHotelCodes = new Set(existing.map(hotel => hotel.HotelCode));
    const uniqueNewOnes = newOnes.filter(hotel => !seenHotelCodes.has(hotel.HotelCode));
    return [...existing, ...uniqueNewOnes];
  }, []);

  // Helper function to sort hotels by price
  const sortHotelsByPrice = useCallback((hotels: SkiHotel[]): SkiHotel[] => {
    return hotels.sort((a, b) => {
      const priceA = parseFloat(a.PricesInfo.AmountAfterTax) || 0;
      const priceB = parseFloat(b.PricesInfo.AmountAfterTax) || 0;
      return priceA - priceB;
    });
  }, []);

  const handleHotelClick = (hotel: SkiHotel) => {
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
    setHotels([]);
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
      const groupSizePromises: Promise<{ groupSize: number; hotels: SkiHotel[] }>[] = [];
      
      for (let groupSize = searchParams.group_size; groupSize <= maxGroupSize; groupSize++) {
        const groupSearchParams = {
          ...searchParams,
          group_size: groupSize
        };
        
        const promise = ApiService.searchSkiHotelsForGroupSize(groupSearchParams)
          .then(hotels => ({ groupSize, hotels }))
          .catch(error => {
            console.error(`Error fetching group size ${groupSize}:`, error);
            return { groupSize, hotels: [] };
          });
        
        groupSizePromises.push(promise);
      }

      // Process results as they come in
      let allHotels: SkiHotel[] = [];
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
          const { hotels: newHotels } = result.value;
          
          // Deduplicate and add new hotels
          allHotels = deduplicateHotels(allHotels, newHotels);
          
          // Sort and update state immediately
          const sortedHotels = sortHotelsByPrice(allHotels);
          setHotels(sortedHotels);
        }
      });

    } catch (error) {
      console.error('Search failed:', error);
      setHotels([]);
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
          <HotelResults 
            hotels={hotels} 
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
