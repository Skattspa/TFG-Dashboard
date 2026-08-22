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

  it('debe actualizar el estado reactivo al recibir datos del API Gateway', () => {
    const mockData = { temperature: 25, humidity: 50 };
    const ciudad = 'Madrid';

    service.state$.subscribe((data) => {
      if (data) {
        expect(data.temperatura).toBe(25);
        expect(data.humedad).toBe(50);
      }
    });

    service.fetchWeatherData(ciudad);

    const expectedUrl = `${environment.apiUrl}/weather?ciudad=${ciudad}`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
