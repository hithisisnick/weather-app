import React, { useEffect, useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';

const Searchbar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Only search if there's actual input
    if (value.trim().length > 0) {
      // Wait for 1 second before calling onSearch
      const timeout = setTimeout(() => {
        onSearch(value);
      }, 1000);
      setSearchTimeout(timeout);
    } else {
      onSearch('');
    }
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className='relative w-full'>
      <form onSubmit={handleSubmit} className='flex items-center gap-2 w-full'>
        <div className='relative w-full'>
          <input
            type='text'
            id='floating_helper'
            aria-describedby='floating_helper_text'
            className='block rounded-lg px-2.5 pb-1.5 pt-4 w-full text-[12px] text-black dark:text-white bg-white/20 dark:bg-darkgray/40 border-0 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 peer focus:text-[12px]'
            value={query}
            onChange={handleChange}
            placeholder=' '
          />
          <label
            htmlFor='floating_helper'
            className='absolute text-[12px] text-black/40 dark:text-white/40 duration-300 transform scale-75 -translate-y-1/2 top-1/2 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto'>
            Search
          </label>
        </div>
        <button
          type='submit'
          className='p-2 rounded-lg bg-purple dark:bg-purple-dark'
          aria-label='Search'>
          <MagnifyingGlass size={24} color='white' />
        </button>
      </form>
    </div>
  );
};

export default Searchbar;
