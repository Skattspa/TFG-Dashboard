import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { WeatherDataService } from '../../core/weather-data.service';
import { of } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

const activatedRouteMock = {
  snapshot: {
    paramMap: convertToParamMap({
      metric: 'temperatura',
    }),
  },
};

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(async () => {
    const weatherServiceSpy = {
      state$: of(null),
    };

    await TestBed.configureTestingModule({
      imports: [DetailsComponent],
      providers: [
        { provide: WeatherDataService, useValue: weatherServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });
});
