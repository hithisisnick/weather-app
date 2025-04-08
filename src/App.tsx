import { useState } from 'react';
import './App.css';
import { WeatherService } from './services/weatherService';
import { GeocodingResult, WeatherResult } from './types';
import Searchbar from './components/Searchbar';
import SearchResult from './components/SearchResult';
import { ArrowRight } from '@phosphor-icons/react';

import ThemeSwitcher from './components/ThemeSwitcher';
import { Loading } from './components/Loading';

function App() {
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<WeatherResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [searchHistory, setSearchHistory] = useState<WeatherResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const weatherService = new WeatherService(import.meta.env.VITE_OPENWEATHER_API_KEY);

  const handleSearch = async (query: string) => {
    // If query is empty, clear results and hide them
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      setHasSearched(false);

      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setShowResults(true);

    try {
      const response = await weatherService.searchLocations(query);

      setSearchResults(response);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = async (result: GeocodingResult) => {
    setLoading(true);
    setShowResults(false);

    try {
      const weatherData = await weatherService.getWeather(result.lat, result.lon);
      const weatherDataWithTimestamp = {
        ...weatherData,
        timestamp: new Date().getTime(),
      };

      setSelectedResult(weatherDataWithTimestamp);

      setSearchHistory((prevHistory) => {
        const exists = prevHistory.some(
          (item) =>
            item.name === weatherDataWithTimestamp.name &&
            item.sys.country === weatherDataWithTimestamp.sys.country
        );

        if (!exists) {
          return [...prevHistory, weatherDataWithTimestamp];
        }
        return prevHistory;
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const removeFromHistory = (indexToRemove: number) => {
    setSearchHistory((prevHistory) =>
      prevHistory.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <>
      <meta name='description' content='Put your description here.' />
      <main className='flex flex-col p-4 pb-0 md:px-0 h-screen bg-[url(./assets/bg-light.webp)] dark:bg-[url(./assets/bg-dark.webp)] bg-cover bg-center overflow-hidden'>
        <ThemeSwitcher />

        <div className='flex flex-col w-full max-w-[700px] h-full mx-auto'>
          <Searchbar onSearch={handleSearch} />

          {/* Display loading text */}
          {loading && <Loading />}

          {/* Display any error message */}
          {error && (
            <div
              className='flex items-center p-4 mt-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50/50 dark:bg-gray-800/70 dark:text-red-400 dark:border-red-800'
              role='alert'>
              <svg
                className='shrink-0 inline w-4 h-4 me-3'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 20'>
                <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z' />
              </svg>
              <span className='sr-only'>Info</span>
              <div>
                <span className='font-medium'>Error:</span> {error}
              </div>
            </div>
          )}

          {/* Search Results Section */}
          {showResults && (
            <div className='flex flex-col gap-4 my-4'>
              {hasSearched && searchResults.length > 0 && (
                <div className='bg-white/20 dark:bg-darkgray/40 text-black dark:text-white rounded-lg p-4'>
                  <h2 className='text-sm font-normal mb-2'>
                    Found {searchResults.length} results:
                  </h2>
                  <ul className='flex flex-col gap-2'>
                    {searchResults.map((item: GeocodingResult, index) => (
                      <li key={index} className='text-sm font-normal'>
                        <button
                          className='flex items-center gap-2 cursor-pointer'
                          onClick={() => handleResultClick(item)}
                          aria-label={`Select ${item.name}, ${item.country}`}>
                          <span>
                            {item.name}, {item.country}
                          </span>
                          <ArrowRight size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* No Results Message */}
              {showResults && hasSearched && searchResults.length === 0 && !loading && (
                <div
                  className='flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-white/20 dark:bg-darkgray/40 dark:text-red-400'
                  role='alert'>
                  <span className='sr-only'>Info</span>
                  <div>
                    <span className='font-medium'>No results found!</span> Please try
                    again.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Selected Result Section */}
          {selectedResult && (
            <SearchResult
              data={selectedResult}
              searchHistory={searchHistory}
              onRemoveFromHistory={removeFromHistory}
              onSelectResult={setSelectedResult}
            />
          )}
        </div>
      </main>
    </>
  );
}

export default App;
