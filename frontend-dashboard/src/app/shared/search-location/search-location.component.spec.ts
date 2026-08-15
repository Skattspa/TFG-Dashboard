import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchLocationComponent } from './search-location.component';
import { WeatherDataService } from '../../core/weather-data.service'; // Ajusta la ruta si es necesario
import { of } from 'rxjs';

describe('SearchLocationComponent', () => {
  let component: SearchLocationComponent;
  let fixture: ComponentFixture<SearchLocationComponent>;
  let weatherServiceSpy: any;

  beforeEach(async () => {
    const spy = {
      fetchWeatherData: jest.fn(),
      isLoading$: of(false),
    };

    await TestBed.configureTestingModule({
      imports: [SearchLocationComponent],
      providers: [{ provide: WeatherDataService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchLocationComponent);
    component = fixture.componentInstance;

    weatherServiceSpy = TestBed.inject(WeatherDataService);
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe llamar al servicio con la ciudad introducida y limpiar el input', () => {
    const mockEvent = new Event('submit');
    mockEvent.preventDefault = jest.fn();
    const mockInput = { value: 'Tokio' } as HTMLInputElement;
    component.buscarCiudad(mockEvent, mockInput);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(weatherServiceSpy.fetchWeatherData).toHaveBeenCalledWith('Tokio');
    expect(mockInput.value).toBe('');
  });

  it('no debe llamar al servicio si el input está vacío', () => {
    const mockEvent = new Event('submit');
    mockEvent.preventDefault = jest.fn();
    const mockInput = { value: '   ' } as HTMLInputElement;

    component.buscarCiudad(mockEvent, mockInput);
    expect(weatherServiceSpy.fetchWeatherData).not.toHaveBeenCalled();
  });
});
