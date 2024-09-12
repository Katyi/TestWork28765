import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SavedForecastState {
  savedForecastData: any[];
  addToSaved: (data: any) => void;
}

const useSavedForecastStore = create<SavedForecastState>()(
  persist(
    (set, get) => ({
      savedForecastData: [],
      addToSaved: (data: any) => {
        const { savedForecastData } = get();
        const updatedForecast = addToSavedForecast(savedForecastData, data);
        set({ savedForecastData: updatedForecast });
      },
    }),
    { name: 'saved-forecast-data', getStorage: () => sessionStorage }
  )
);

export default useSavedForecastStore;

const addToSavedForecast = (savedForecastData: any[], data: any) => {
  const item = savedForecastData.find((item) => item.id === data.id);

  if (item) {
    return savedForecastData.map((item) => {
      return item;
    });
  }

  return [...savedForecastData, { ...data }];
};
