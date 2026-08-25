import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { WeatherDataService } from './weather-data.service';
import { environment } from '../../environments/environment';

describe('WeatherDataService', () => {
  let service: WeatherDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeatherDataService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(WeatherDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse correctamente el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe actualizar el estado reactivo al recibir datos del API Gateway, incluyendo lluvia', () => {
    // 1. Actualizamos el mock con la nueva métrica
    const mockData = {
      temperatura: 25,
      humedad: 50,
      viento: 15,
      precipitacion: 2.5,
      pronostico24h: { precipitaciones: [2.5, 3.0] },
    };
    const ciudad = 'Madrid';

    service.state$.subscribe((data) => {
      if (data) {
        // 2. Validamos que el BehaviorSubject emita las nuevas variables
        expect(data.temperatura).toBe(25);
        expect(data.humedad).toBe(50);
        expect(data.precipitacion).toBe(2.5);
        expect(data.pronostico24h.precipitaciones).toEqual([2.5, 3.0]);
      }
    });

    service.fetchWeatherData(ciudad);

    const expectedUrl = `${environment.apiUrl}/weather?ciudad=${ciudad}`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
