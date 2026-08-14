import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators'; // Añadimos finalize

export interface WeatherData {
  ciudad?: string; // Añadimos la ciudad que nos devuelve el backend
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

  // NUEVO: Estado para saber si estamos cargando
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Ahora pedimos la ciudad por defecto (San Francisco)
  public fetchWeatherData(ciudad: string = 'San Francisco'): void {
    this.errorSubject.next(null);
    this.loadingSubject.next(true); // Empezamos a cargar
    
    // Enviamos el nombre de la ciudad al Gateway
    const gatewayUrl = `http://localhost:3000/api/weather?ciudad=${encodeURIComponent(ciudad)}`;
    
    this.http.get<WeatherData>(gatewayUrl)
      .pipe(
        // finalize se ejecuta siempre, haya éxito o error
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe({
        next: (data) => {
          this.weatherSubject.next(data);
          console.log('[Store Reactivo] Datos actualizados:', data);
        },
        error: (err) => {
          this.errorSubject.next(err.message);
        }
      });
  }
}