import React, { useCallback, useState } from 'react';
import { TextField, Grid, Box, Typography, Button } from '@material-ui/core';

import { groupBy } from 'lodash';
import { format } from 'date-fns';
import WeatherInfo, { WeatherInfoType } from './components/WeatherInfo';
import AutoComplete from './components/AutoComplete';
import FiveDayWeatherInfo from './components/FiveDayWeatherInfo';

export type CityType = {
  title: string;
};

export type FiveDayForecastType = {
  date: string;
  forecast: WeatherInfoType[];
};

enum FetchForecastEnum {
  NOW,
  FIVEDAY,
}

const BASE_URL = 'http://api.openweathermap.org/data/2.5';

const App = () => {
  const [city, setCity] = useState<CityType | null>(null);
  const [todayWeatherInfo, setTodayWeatherInfo] =
    useState<WeatherInfoType | null>(null);
  const [fiveDayWeatherInfo, setFiveDayWeatherInfo] =
    useState<FiveDayForecastType[] | null>(null);

  const cities = [
    { title: 'Agronômica' },
    { title: 'Blumenau' },
    { title: 'Florianópolis' },
    { title: 'Rio de Janeiro' },
    { title: 'Rio do Sul' },
    { title: 'São Paulo' },
  ] as CityType[];

  const onSelectItem = (value: CityType) => {
    setCity(value);
    setTodayWeatherInfo(null);
    setFiveDayWeatherInfo(null);
  };

  const fetchForecast = useCallback(
    async (type: FetchForecastEnum) => {
      if (!city) {
        return;
      }

      if (type === FetchForecastEnum.NOW) {
        const request = await fetch(
          `${BASE_URL}/weather?q=${city?.title}&appid=${process.env.REACT_APP_API_KEY}&units=metric`,
        );
        const response = await request.json();

        setFiveDayWeatherInfo(null);
        setTodayWeatherInfo(response.main);
        return;
      }

      const request = await fetch(
        `${BASE_URL}/forecast?q=${city?.title}&appid=${process.env.REACT_APP_API_KEY}&units=metric`,
      );
      const response = await request.json();

      const fiveDayForecast = response?.list?.map((forecast: any) => {
        const date = format(new Date(forecast.dt_txt), 'yyyy-MM-dd');

        return {
          ...{
            ...forecast.main,
            dateAndTime: forecast.dt_txt,
          },
          date,
        };
      });

      const groupedForecast = groupBy(fiveDayForecast, 'date');

      setFiveDayWeatherInfo(
        Object.keys(groupedForecast)?.map(d => ({
          date: d,
          forecast: groupedForecast[d],
        })),
      );
      setTodayWeatherInfo(null);
    },
    [city],
  );

  return (
    <Box pt={8}>
      <Grid container direction="column" alignItems="center">
        <Grid item sm={12} md={6} lg={8} style={{ width: '100%' }}>
          <AutoComplete
            value={city}
            onChange={onSelectItem}
            options={cities}
            renderInput={(params: any) => (
              <TextField {...params} label="City" variant="outlined" />
            )}
          />
        </Grid>

        <Box mt={2}>
          <Typography
            gutterBottom
            variant="h6"
            color="textPrimary"
            component="h4"
          >
            Temperature By:
          </Typography>

          <Grid container direction="row">
            <Button
              color="primary"
              onClick={() => fetchForecast(FetchForecastEnum.NOW)}
            >
              Today
            </Button>
            <Button
              color="primary"
              onClick={() => fetchForecast(FetchForecastEnum.FIVEDAY)}
            >
              5-day
            </Button>
          </Grid>
        </Box>

        {todayWeatherInfo !== null && (
          <Grid item sm={12} md={6} lg={8} style={{ width: '100%' }}>
            <WeatherInfo data={todayWeatherInfo} city={city?.title} />
          </Grid>
        )}

        {fiveDayWeatherInfo !== null && (
          <Grid item sm={12} md={6} lg={8} style={{ width: '100%' }}>
            <FiveDayWeatherInfo data={fiveDayWeatherInfo} city={city?.title} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default App;
