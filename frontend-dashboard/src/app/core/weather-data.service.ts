import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface WeatherData {
  ciudad: string;
  temperatura: number;
  humedad: number;
  viento: number;
  precipitacion: number;
  pronostico24h: {
    horas: string[];
    temperaturas: number[];
    humedades: number[];
    vientos: number[];
    precipitaciones: number[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class WeatherDataService {
  private weatherSubject = new BehaviorSubject<WeatherData | null>(null);
  public state$: Observable<WeatherData | null> = this.weatherSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$: Observable<string | null> = this.errorSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  public fetchWeatherData(ciudad: string = 'San Francisco'): void {
    this.errorSubject.next(null);
    this.loadingSubject.next(true);

    // Utilizamos environment.apiUrl en lugar del string fijo
    const gatewayUrl = `${environment.apiUrl}/weather?ciudad=${encodeURIComponent(ciudad)}`;

    this.http
      .get<WeatherData>(gatewayUrl)
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: (data: WeatherData) => {
          this.weatherSubject.next(data);
          // console.log('[Store Reactivo] Datos actualizados:', data);
        },
        error: (err) => {
          this.errorSubject.next(err.message);
        },
      });
  }

  public getCurrentStateValue(): WeatherData | null {
    return this.weatherSubject.getValue();
  }
}
