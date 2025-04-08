import { MagnifyingGlass, TrashSimple } from '@phosphor-icons/react';
import cloud from '../assets/cloud.webp';
import sun from '../assets/sun.webp';

interface SearchResultProps {
  data: data;
  searchHistory: data[];
  onRemoveFromHistory: (index: number) => void;
  onSelectResult: (result: data) => void;
}

interface data {
  name: string;
  sys: {
    country: string;
  };
  main: {
    humidity: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  weather: {
    main: string;
  }[];
  timestamp: number;
}

const SearchResult = ({
  data,
  searchHistory,
  onRemoveFromHistory,
  onSelectResult,
}: SearchResultProps) => {
  const formatDate = (timestamp: number) => {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace(/\//g, '-')
      .replace(/,/g, '');
  };

  return (
    <div className='flex flex-col gap-5 py-5 px-6 pb-0 mt-auto h-3/4 w-full bg-white/20 dark:bg-darkgray/40 rounded-t-[20px] outline outline-white/50 dark:outline-0 backdrop-blur-lg'>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-2 relative shrink-0'>
        <h2 className='col-span-1 text-sm font-normal text-black dark:text-white'>
          Today's Weather
        </h2>

        {/* Weather image */}
        <img
          src={data.weather[0].main === 'Clouds' ? cloud : sun}
          alt='weather'
          className='w-[157px] h-[157px] absolute -top-1/2 -translate-y-5 -right-5'
        />

        {/* Temperature */}
        <span className='col-start-1 row-start-2 text-5xl font-semibold text-purple dark:text-white'>
          {data.main.temp.toFixed(0)}°
        </span>

        {/* Max and Min Temperature */}
        <span className='col-start-1 row-start-3 text-xs md:text-[16px] text-black dark:text-white'>
          H: {data.main.temp_max.toFixed(0)}° L: {data.main.temp_min.toFixed(0)}°
        </span>

        {/* Weather type */}
        <span className='col-start-2 row-start-2 md:col-start-4 md:row-start-4 text-xs md:text-[16px] font-normal text-darkgray dark:text-white text-end self-end md:self-auto md:text-right'>
          {data.weather[0].main}
        </span>

        {/* Humidity */}
        <span className='col-start-2 row-start-3 md:col-start-3 md:row-start-4 text-xs md:text-[16px] text-darkgray dark:text-white text-end md:text-right'>
          Humidity: {data.main.humidity}%
        </span>

        {/* City and Country */}
        <span className='col-start-1 row-start-4 text-xs md:text-[16px] text-darkgray dark:text-white font-semibold'>
          {data.name}, {data.sys.country}
        </span>

        {/* Date and Time */}
        <span className='col-start-2 row-start-4 text-xs md:text-[16px] text-darkgray dark:text-white font-normal text-end md:text-start'>
          {formatDate(data.timestamp)}
        </span>
      </div>

      <div className='flex flex-col flex-1 min-h-0 bg-white/20 dark:bg-darkgray/40 rounded-t-[20px]'>
        <h3 className='text-sm text-black dark:text-white p-4 shrink-0'>
          Search History
        </h3>

        <div className='overflow-y-auto flex-1 px-4 pb-4'>
          <ul className='flex flex-col gap-4.5'>
            {[...searchHistory].reverse().map((item, index) => (
              <li
                key={index}
                className='flex items-center justify-between w-full md:gap-2.5 bg-white/40 dark:bg-darkgray/50 px-2.5 py-3.5 rounded-2xl shrink-0'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between md:w-full gap-0.5 text-black dark:text-white font-normal'>
                  <span className='text-sm'>
                    {item.name}, {item.sys.country}
                  </span>
                  <span className='text-[10px] md:text-sm'>
                    {formatDate(item.timestamp)}
                  </span>
                </div>

                {/* Buttons for selecting and removing from history */}
                <div className='flex gap-2.5'>
                  <button
                    className='flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-transparent dark:border dark:border-white/40 shadow-lg cursor-pointer'
                    onClick={() => onSelectResult(item)}
                    aria-label={`Select ${item.name}, ${item.sys.country}`}>
                    <MagnifyingGlass
                      size={16}
                      opacity={0.5}
                      weight='bold'
                      className='text-black dark:text-white'
                    />
                  </button>
                  <button
                    className='flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-transparent dark:border dark:border-white/40 shadow-lg cursor-pointer'
                    onClick={() => onRemoveFromHistory(searchHistory.length - 1 - index)}
                    aria-label='Remove from history'>
                    <TrashSimple
                      size={16}
                      weight='fill'
                      opacity={0.5}
                      className='text-black dark:text-white'
                    />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
