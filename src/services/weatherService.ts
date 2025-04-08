import { GeocodingResult, WeatherResult } from '../types';

export class WeatherService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openweathermap.org';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchLocations(query: string): Promise<GeocodingResult[]> {
    const response = await fetch(
      `${this.baseUrl}/geo/1.0/direct?q=${query}&limit=5&appid=${this.apiKey}`
    );
    if (!response.ok) throw new Error('Failed to fetch search results');
    return response.json();
  }

  async getWeather(lat: number, lon: number): Promise<WeatherResult> {
    const response = await fetch(
      `${this.baseUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
    );
    if (!response.ok) throw new Error('Failed to fetch weather data');
    return response.json();
  }
}
