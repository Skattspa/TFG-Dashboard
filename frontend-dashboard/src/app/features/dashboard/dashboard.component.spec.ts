import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { WeatherDataService } from '../../core/weather-data.service';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    const weatherServiceSpy = {
      state$: of(null),
      isLoading$: of(false),
      getCurrentStateValue: jest.fn().mockReturnValue({}),
      fetchWeatherData: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: WeatherDataService, useValue: weatherServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });
});
