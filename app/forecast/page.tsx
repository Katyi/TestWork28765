'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

import { useCityStore } from '@/store/cityStore';
import useWeatherStore from '@/store/weatherStore';
import useForecastStore from '@/store/forecastStore';
import style from './page.module.scss';

const Forecast = () => {
  const { city } = useCityStore();
  const { weatherData } = useWeatherStore();
  const { forecastData, setForecastData } = useForecastStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

  const getForecastData = async (lat: number, lon: number) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      const response = await axios.get(url);
      setForecastData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    getForecastData(weatherData?.coord.lat, weatherData?.coord.lon);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={style.container}>
      {isLoading ? (
        <div
          className={`w-100 d-flex justify-content-center align-items-center ${style.loading}`}
        >
          <p className="h2">Loading weather data...</p>
        </div>
      ) : (
        <>
          <p className="h2 mb-3 pt-4">
            8-day forecast for {city}
            {weatherData?.sys?.country ? `, ${weatherData?.sys?.country}` : ''}
          </p>
          {forecastData ? (
            <div className="w-75 d-flex flex-column align-items-center mb-3">
              {forecastData?.list
                .filter(
                  (item: { dt_txt: string }) =>
                    item.dt_txt.split(' ')[1] === '12:00:00' ||
                    item.dt_txt.split(' ')[1] === '00:00:00'
                )
                .map(
                  (item: {
                    weather: {
                      main: string;
                      description: string;
                      icon: string;
                    }[];
                    main: { temp: number };
                    dt_txt: string;
                    dt: string;
                  }) => (
                    <div
                      className="d-flex align-items-center justify-content-between w-75"
                      key={item.dt_txt}
                    >
                      <p className="fs-6">{item.dt_txt}</p>
                      <Image
                        src={`https://openweathermap.org/img/wn/${item?.weather[0].icon}@2x.png`}
                        alt="icon1"
                        width={50}
                        height={50}
                      />
                      <p className="fs-6">{item?.main?.temp} °C</p>
                      <p className={`fs-6 ${style.description}`}>
                        {item.weather[0].main}, {item.weather[0].description}
                      </p>
                    </div>
                  )
                )}
            </div>
          ) : (
            <p className="h5 mt-5">Please select a city</p>
          )}
        </>
      )}
    </div>
  );
};

export default Forecast;
