import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CityState {
  city: string | null;
  setCity: (data: string) => void;
}

export const useCityStore = create<CityState>()(
  persist(
    (set, get) => ({
      city: null,
      setCity: (data) => set({ city: data }),
    }),
    { name: 'city-data', getStorage: () => sessionStorage }
  )
);
