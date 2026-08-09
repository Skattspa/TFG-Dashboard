import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface WeatherData {
  temperatura: number;
  humedad: number;
  viento: number;
}

@Injectable({
  providedIn: 'root' 
})
export class WeatherDataService {
  
  private weatherSubject = new BehaviorSubject<WeatherData | null>(null);

  public state$: Observable<WeatherData | null> = this.weatherSubject.asObservable();

  constructor(private http: HttpClient) {}

  public fetchWeatherData(lat: number = 37.763283, lon: number = -122.41286): void {
    const gatewayUrl = `http://localhost:3000/api/weather?lat=${lat}&lon=${lon}`;
    
    this.http.get<WeatherData>(gatewayUrl).subscribe({
      next: (data) => {
        this.weatherSubject.next(data);
        console.log('[Store Reactivo] Datos meteorológicos actualizados:', data);
      },
      error: (error) => {
        console.error('[Store Reactivo] Error conectando con el API Gateway:', error);
      }
    });
  }
}