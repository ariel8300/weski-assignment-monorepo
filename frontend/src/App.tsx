import React, { useState } from 'react'
import NavBar from './components/navbar/nav-bar'
import AccommodationResults, { SkiAccommodation } from './components/accommodation-results/accommodation-results'
import { ApiService, SearchParams } from './services/api.service'
import './App.scss'

const App: React.FC = () => {
  const [accommodations, setAccommodations] = useState<SkiAccommodation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchParams: SearchParams) => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const results = await ApiService.searchSkiAccommodations(searchParams);
      setAccommodations(results);
    } catch (error) {
      console.error('Search failed:', error);
      setAccommodations([]);
    } finally {
      setIsLoading(false);
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
          />
        )}
      </main>
    </div>
  )
}

export default App
