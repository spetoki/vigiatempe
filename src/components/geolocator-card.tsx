"use client";

import { useState, useEffect } from "react";
import { Copy, Check, MapPin, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Location {
  latitude: number;
  longitude: number;
}

export function GeoLocatorCard() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("A geolocalização não é suportada pelo seu navegador.");
      setLoading(false);
      return;
    }

    const success = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setLoading(false);
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
          setError("Ocorreu um erro desconhecido.");
          break;
      }
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, handleError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
    });
  }, []);

  const handleCopy = () => {
    if (location) {
      const coordinates = `${location.latitude}, ${location.longitude}`;
      navigator.clipboard.writeText(coordinates);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl transition-all duration-500 bg-card/80 backdrop-blur-sm border">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="mt-4 text-2xl font-bold">GeoLocator</CardTitle>
        <CardDescription>Suas coordenadas geográficas em tempo real</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6 min-h-[180px]">
        {loading && (
          <div className="flex flex-col items-center gap-4 text-muted-foreground transition-opacity duration-300">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
            <p>Obtendo sua localização...</p>
          </div>
        )}
        {error && (
            <div className="text-center text-destructive transition-opacity duration-300">
                <p className="font-semibold">Falha ao obter localização</p>
                <p className="text-sm">{error}</p>
            </div>
        )}
        {location && !loading && (
          <div className="flex w-full flex-col items-center gap-6 animate-in fade-in duration-500">
            <div className="flex w-full justify-around gap-4">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Latitude</p>
                    <p className="text-2xl font-semibold tracking-wider font-code text-primary">{location.latitude.toFixed(6)}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Longitude</p>
                    <p className="text-2xl font-semibold tracking-wider font-code text-primary">{location.longitude.toFixed(6)}</p>
                </div>
            </div>
            <Button onClick={handleCopy} className="w-full transition-colors" variant="default">
              {isCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Copiado!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" /> Copiar Coordenadas
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
