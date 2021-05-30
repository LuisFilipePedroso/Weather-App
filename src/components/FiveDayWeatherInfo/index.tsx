import React, { memo } from 'react';
import { Box, Typography } from '@material-ui/core';

import { format } from 'date-fns';
import WeatherInfo from '../WeatherInfo';
import { FiveDayForecastType } from '../../App';

type Props = {
  data: FiveDayForecastType[] | null;
  city: string | undefined;
};

function FiveDayWeatherInfo({ data, city }: Props) {
  return (
    <Box mt={5} justifySelf="center" width="100%">
      {data?.map(d => (
        <>
          <Box mt={3}>
            <Typography
              gutterBottom
              variant="h6"
              color="textPrimary"
              component="h4"
              style={{ color: '#c02762' }}
            >
              {format(new Date(d.date), 'dd/MM/yyyy')}
            </Typography>
          </Box>
          {d.forecast.map(_forecast => {
            const hour = format(
              new Date(_forecast.dateAndTime as string),
              'HH:mm',
            );

            const currentTempLabel = `Temperatura as ${hour} horas`;

            return (
              <WeatherInfo
                data={_forecast}
                city={city}
                currentTempLabel={currentTempLabel}
                canSetAsFavorite={false}
                key={_forecast.temp}
              />
            );
          })}
        </>
      ))}
    </Box>
  );
}

export default memo(FiveDayWeatherInfo);
