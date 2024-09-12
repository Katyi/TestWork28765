'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import useSavedForecastStore from '@/store/savedForecastStore';
import { getDate } from '@/lib/utils';
import { getTime } from '@/lib/utils';
import style from './page.module.scss';

const SavedForecast = () => {
  const { savedForecastData } = useSavedForecastStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setInterval(() => setIsLoading(false), 100);
  }, []);

  if (!isMounted) {
    return null;
  }

  return isLoading ? (
    <div
      className={`w-100 d-flex justify-content-center align-items-center ${style.loading}`}
    >
      <p className="h2">Loading weather data...</p>
    </div>
  ) : (
    <div className={style.container}>
      <p className="h2 pt-4 mb-3">Forecast saved by user</p>
      {savedForecastData.length === 0 && (
        <p className="h5 mt-5">Please select a city</p>
      )}
      {savedForecastData.map(
        (item: {
          id: number;
          name: string;
          dt: number;
          main: { temp: number };
          weather: { main: string; description: string; icon: string }[];
        }) => (
          <div
            className="d-flex align-items-center justify-content-between w-75"
            key={item.id}
          >
            <div className="d-flex gap-2">
              <p>{getDate(item.dt)}</p>
              <p>{getTime(item.dt)}</p>
            </div>
            <p className={`fs-6 ${style['city-name']}`}>{item.name}</p>

            <Image
              src={`https://openweathermap.org/img/wn/${item?.weather[0].icon}@2x.png`}
              alt="icon1"
              width={50}
              height={50}
            />
            <p className={`fs-6 ${style.temp}`}>{item.main.temp} °C</p>
            <p className={`fs-6 ${style.description}`}>
              {item.weather[0].main}, {item.weather[0].description}
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default SavedForecast;
