import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ForecastState {
  forecastData: any;
  setForecastData: (data: any) => void;
}

const useForecastStore = create<ForecastState>()(
  persist(
    (set) => ({
      forecastData: null,
      setForecastData: (data: any) => set({ forecastData: data }),
    }),
    { name: 'forecast-data', getStorage: () => sessionStorage }
  )
);

export default useForecastStore;
