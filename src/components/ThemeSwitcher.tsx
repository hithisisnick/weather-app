import { useState, useEffect } from 'react';
import { Moon, Sun } from '@phosphor-icons/react';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    // Update the HTML class and localStorage when theme changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      className='fixed z-10 bottom-2 right-2 md:bottom-4 md:right-4 p-2 rounded-lg text-white bg-purple dark:bg-purple-dark hover:bg-purple/80 dark:hover:bg-purple-dark/70 transition-colors cursor-pointer'
      aria-label='Toggle theme'>
      {theme === 'light' ? (
        <Moon size={24} weight='fill' />
      ) : (
        <Sun size={24} weight='fill' />
      )}
    </button>
  );
};

export default ThemeSwitcher;
