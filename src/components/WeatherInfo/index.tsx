import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, Card, CardActionArea, CardActions, CardContent, Grid, Paper, Typography } from '@material-ui/core';

import { CityType } from '../../App';

export type WeatherInfoType = {
  humidity: number;
  temp: number;
  temp_max: number;
  temp_min: number;
  dateAndTime?: string;
}

type Props = {
  data: WeatherInfoType;
  city: string | undefined;
  currentTempLabel?: string;
  canSetAsFavorite?: boolean;
}

function WeatherInfo({ data, city, currentTempLabel = 'Temperatura', canSetAsFavorite = true }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    let favorites = localStorage.getItem('@weatherapp/favorites_cities');

    if (favorites !== null) {
      const parsedFavorites = JSON.parse(favorites) as CityType[];

      const exists = parsedFavorites.find(c => c.title === city);

      if (exists) {
        setIsFavorite(true);
      }
    }

    return () => {
      setIsFavorite(false);
    }
  }, [city]);

  const tempIcon = useMemo(() => data?.temp > 20 ? '☀️' : '🥶', [data?.temp]);

  const setAsFavorite = useCallback(() => {
    let favorites = localStorage.getItem('@weatherapp/favorites_cities');

    if (favorites !== null) {
      const parsedFavorites = JSON.parse(favorites) as CityType[];

      const exists = parsedFavorites.find(c => c.title === city);

      if (exists) {
        const newFavorites = parsedFavorites.filter(c => c.title !== city);
        console.log('NEW FAVORITES: ', newFavorites);
        localStorage.setItem('@weatherapp/favorites_cities', JSON.stringify(newFavorites));
        setIsFavorite(false);
        return;
      }

      localStorage.setItem('@weatherapp/favorites_cities', JSON.stringify([...parsedFavorites, { title: city }]));
      setIsFavorite(true);
      return;
    }

    localStorage.setItem('@weatherapp/favorites_cities', JSON.stringify([{ title: city }]));
    setIsFavorite(true);
  }, [city]);

  const cityName = useMemo(() => isFavorite ? `${city} 🌟` : city, [city, isFavorite]);

  const favoriteButtonText = useMemo(() => isFavorite ? 'Unset as Favorite ★' : 'Set as Favorite ★', [isFavorite]);

  return (
    <Box mt={3} justifySelf="center" width="100%">
      <Grid item sm={12} md={12} lg={12}>
        <Card>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h4" component="h3">
                {cityName}
              </Typography>
              <Typography gutterBottom variant="h6" color="textPrimary" component="h4">
                {tempIcon} {currentTempLabel}: {data.temp} °C
              </Typography>
              <Typography gutterBottom variant="body1" color="textPrimary" component="h3">
                💧 Umidade: {data.humidity}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="h4">
                🔽 Temperatura Mínima: {data.temp_min} °C
              </Typography>
              <Typography variant="body2" color="textSecondary" component="h4">
                🔼 Temperatura Máxima: {data.temp_max} °C
              </Typography>
            </CardContent>
          </CardActionArea>
          {canSetAsFavorite && (
            <CardActions>
              <Button size="small" color="primary" onClick={setAsFavorite}>
                {favoriteButtonText}
              </Button>
            </CardActions>
          )}
        </Card>
      </Grid>
    </Box>
  );
}

export default memo(WeatherInfo);
