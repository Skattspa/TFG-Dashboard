import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { WeatherDataService } from '../../core/weather-data.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

HTMLCanvasElement.prototype.getContext = jest.fn() as any;
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    const mockState = {
      ciudad: 'San Francisco',
      temperatura: 20,
      humedad: 45,
      viento: 12,
      precipitacion: 1.5,
      pronostico24h: {
        horas: [],
        temperaturas: [],
        humedades: [],
        vientos: [],
        precipitaciones: [],
      },
    };
    const weatherServiceSpy = {
      state$: of(mockState),
      isLoading$: of(false),
      getCurrentStateValue: jest.fn().mockReturnValue(mockState),
      fetchWeatherData: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: WeatherDataService, useValue: weatherServiceSpy }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });
});
