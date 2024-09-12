import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WeatherState {
  weatherData: any;
  setWeatherData: (data: any) => void;
}

const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      weatherData: null,
      setWeatherData: (data) => set({ weatherData: data }),
    }),
    { name: 'weather-data', getStorage: () => sessionStorage }
  )
);

export default useWeatherStore;
