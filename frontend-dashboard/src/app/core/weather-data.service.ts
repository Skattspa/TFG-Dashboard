import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface WeatherData {
  temperatura: number;
  humedad: number;
  viento: number;
  pronostico24h?: {
    horas: string[];
    temperaturas: number[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {
  private weatherSubject = new BehaviorSubject<WeatherData | null>(null);
  public state$: Observable<WeatherData | null> = this.weatherSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$: Observable<string | null> = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  public fetchWeatherData(lat: number = 37.763283, lon: number = -122.41286): void {
    // Limpiamos cualquier error previo antes de hacer la petición
    this.errorSubject.next(null);
    
    const gatewayUrl = `http://localhost:3000/api/weather?lat=${lat}&lon=${lon}`;
    
    this.http.get<WeatherData>(gatewayUrl).subscribe({
      next: (data) => {
        this.weatherSubject.next(data);
        console.log('[Store Reactivo] Datos actualizados:', data);
      },
      error: (err) => {
        // Si el interceptor lanza un error, lo guardamos en el estado
        this.errorSubject.next(err.message);
      }
    });
  }
}