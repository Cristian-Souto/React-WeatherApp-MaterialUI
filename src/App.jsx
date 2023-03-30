import React, { useState } from "react";
import { TextField, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import { LoadingButton } from "@mui/lab";

const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_API_KEY}&q=`;

console.log(API_WEATHER)

export default function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState({
    error: false,
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temperature: 0,
    humidity:"",
    condition: "",
    conditionText: "",
    icon: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError({ error: false, message: "" });
    setLoading(true);

    try {
      if (!city.trim()) throw { message: "El campo es obligatorio" };
      const response = await fetch(`${API_WEATHER}${city}`);
      const data = await response.json();

      if (data.error) throw { message: data.error.message };
      setWeather({
        city: data.location.name,
        country: data.location.country,
        temperature: data.current.temp_c,
        humidity:data.current.humidity,
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
      });
    } catch (error) {
      setError({
        error: true,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return(
    <Container
      maxWidth="xs"
      sx={{ mt: 2 }}
    >
      <Typography
        variant="h3"
        component="h1"
        align="center"
        gutterBottom
      >
        Weather App
      </Typography>
      <Box
        sx={{ display: "grid", gap: 2 }}
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          id="city"
          label="Ciudad"
          variant="outlined"
          size="small"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={error.error}
          helperText={error.message}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          loadingIndicator="Buscando..."
        >
          Buscar
        </LoadingButton>
      </Box>

      {weather.city && (
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gap: 2,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
          >
            {weather.city}, {weather.country}
          </Typography>
          <Box
            component="img"
            alt={weather.conditionText}
            src={weather.icon}
            sx={{ margin: "0 auto" }}
          />
          <Typography
            variant="h5"
            component="h3"
          >
            {weather.temperature} °C
          </Typography>
          <Typography
            variant="h5"
            component="h3"
          >
            {weather.humidity} %
          </Typography>
          <Typography
            variant="h6"
            component="h4"
          >
            {weather.conditionText}
          </Typography>
        </Box>
      )}

      <Typography
        textAlign="center"
        sx={{ mt: 2, fontSize: "10px" }}
      >
        Powered by:{" "}
        <a
          href="https://www.weatherapi.com/"
          title="Weather API"
        >
          WeatherAPI.com
        </a>
      </Typography>
    </Container>
  );
}
  