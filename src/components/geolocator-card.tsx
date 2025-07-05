"use client";

import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, CloudSnow, Thermometer, CloudSun, LoaderCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeather, type GetWeatherOutput } from "@/ai/flows/weather-flow";

const weatherIcons: { [key: string]: React.ElementType } = {
  sunny: Sun,
  clear: Sun,
  cloudy: Cloud,
  clouds: Cloud,
  rain: CloudRain,
  drizzle: CloudRain,
  snow: CloudSnow,
  default: Thermometer,
};

const getWeatherIcon = (condition: string) => {
  const lowerCaseCondition = condition.toLowerCase();
  for (const key in weatherIcons) {
    if (lowerCaseCondition.includes(key)) {
      return weatherIcons[key];
    }
  }
  return weatherIcons.default;
};

export function VigiatempeCard() {
  const [weather, setWeather] = useState<GetWeatherOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState("Obtendo sua localização...");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("A geolocalização não é suportada pelo seu navegador.");
      setLoading(false);
      return;
    }

    const fetchWeatherForPosition = async (position: GeolocationPosition) => {
      setLoadingMessage("Verificando o tempo...");
      try {
        const weatherData = await getWeather({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setWeather(weatherData);
      } catch (e) {
        setError("Não foi possível obter os dados do tempo.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const handleError = (error: GeolocationPositionError) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError("Permissão para geolocalização negada.");
          break;
        case error.POSITION_UNAVAILABLE:
          setError("Informação de localização indisponível.");
          break;
        case error.TIMEOUT:
          setError("A requisição de geolocalização expirou.");
          break;
        default:
          setError("Ocorreu um erro desconhecido ao obter a localização.");
          break;
      }
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(fetchWeatherForPosition, handleError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
    });
  }, []);

  const WeatherIcon = weather ? getWeatherIcon(weather.condition) : Thermometer;

  return (
    <Card className="w-full max-w-md shadow-2xl transition-all duration-500 bg-card/80 backdrop-blur-sm border">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
          <CloudSun className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="mt-4 text-2xl font-bold">Vigiatempe</CardTitle>
        <CardDescription>Sua previsão do tempo em tempo real</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6 min-h-[180px]">
        {loading && (
          <div className="flex flex-col items-center gap-4 text-muted-foreground transition-opacity duration-300">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
            <p>{loadingMessage}</p>
          </div>
        )}
        {error && (
            <div className="text-center text-destructive transition-opacity duration-300">
                <p className="font-semibold">Falha ao obter dados</p>
                <p className="text-sm">{error}</p>
            </div>
        )}
        {weather && !loading && (
          <div className="flex w-full flex-col items-center gap-4 animate-in fade-in duration-500">
             <p className="font-semibold text-xl text-foreground">{weather.location}</p>
             <div className="flex items-center gap-4">
              <WeatherIcon className="h-16 w-16 text-primary" />
              <div className="flex flex-col items-center">
                <p className="text-6xl font-bold tracking-tighter text-primary">
                  {weather.temperature.toFixed(0)}°C
                </p>
                <p className="text-lg font-medium text-muted-foreground -mt-1">{weather.condition}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
