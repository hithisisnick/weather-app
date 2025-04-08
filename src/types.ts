export interface GeocodingResult {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface WeatherResult {
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
  dt: number;
}
