'use client';

import { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

import { useCityStore } from '@/store/cityStore';
import useWeatherStore from '@/store/weatherStore';
import useSavedForecastStore from '@/store/savedForecastStore';
import { formatDate } from '@/lib/utils';
import style from './page.module.scss';

const Home = () => {
  const { city, setCity } = useCityStore();
  const { weatherData, setWeatherData } = useWeatherStore();
  const { addToSaved } = useSavedForecastStore();
  const [inputValue, setInputValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const today = formatDate(new Date());
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

  const handleInput = (e: any) => {
    e.preventDefault();
    const value = e.target.value;
    setInputValue(value);
    setCity(value);
  };

  const getWeatherData = async (lat: number, lon: number) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      const response = await axios.get(url);
      setWeatherData(response.data);
      addToSaved(response.data);
      setIsLoading(false);
      setInputValue(null);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!city || city.replace(/\s+/g, '') === '') {
      setError('This field is required.');
    } else {
      setError('');
      try {
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
        const response = await axios.get(url);
        getWeatherData(response.data[0].lat, response.data[0].lon);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    setIsMounted(true);
    setInterval(() => setIsLoading(false), 100);
  }, []);

  if (!isMounted) {
    return null;
  }

  return isLoading ? (
    <div
      className={`w-100 d-flex justify-content-center align-items-center mb-3 ${style.loading}`}
    >
      <p className="h2">Loading weather data...</p>
    </div>
  ) : (
    <div className={style.container}>
      <p className="h2 mb-3 pt-4">Weather {today}</p>
      <div className="w-100 d-flex justify-content-center mb-3 gap-5">
        <Image src="/fall.png" alt="fall" width={500} height={300} />
        <div className={`${style.form}`}>
          <form onSubmit={handleSubmit} className="form-group mb-5">
            <input
              placeholder="Search city"
              className="form-control"
              type="text"
              id="FormControlInput1"
              onChange={handleInput}
              onKeyDown={(e) => {
                e.key === 'Enter' ? handleSubmit : '';
              }}
              value={inputValue || ''}
            />
            <p className={style.error}>{error}</p>
            <button type="submit" className="btn btn-secondary mt-1">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="w-100 d-flex justify-content-center mb-3 gap-5">
        {weatherData ? (
          <>
            <div className={style['info-wrapper-left']}>
              <Image
                src={`http://openweathermap.org/img/wn/${weatherData?.weather[0]?.icon}@2x.png`}
                alt="icon"
                width={150}
                height={150}
              />
              <div className="">
                <p className="h3">
                  {weatherData?.name}
                  {weatherData?.sys?.country
                    ? `, ${weatherData?.sys?.country}`
                    : ''}
                </p>
                <p className="h5">{weatherData?.main?.temp} °C</p>
              </div>
            </div>
            <div className={style['info-wrapper-right']}>
              <p className={`fs-5 ${style.bold}`}>
                Feels like {weatherData?.main?.feels_like} °C.{' '}
                {weatherData?.weather[0]?.main},{' '}
                {weatherData?.weather[0].description}.
              </p>
              <div className="d-flex flex-column">
                <div className="d-flex">
                  <p className={`fs-6 w-25 ${style.bold}`}>Wind: </p>
                  <p className="fs-6">{weatherData?.wind?.speed}m/s</p>
                </div>
                <div className="d-flex">
                  <p className={`fs-6 w-25 ${style.bold}`}>Pressure:</p>
                  <p> {weatherData?.main?.pressure}hPa</p>
                </div>
                <div className="d-flex">
                  <p className={`fs-6 w-25 ${style.bold}`}>Humidity </p>
                  <p className="fs-6">{weatherData?.main?.humidity}%</p>
                </div>
                <div className="d-flex">
                  <p className={`fs-6 w-25 ${style.bold}`}>Visibility</p>
                  <p className="fs-6">{weatherData?.visibility / 1000} km</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Home;
