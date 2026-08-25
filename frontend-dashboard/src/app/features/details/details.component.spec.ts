import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { WeatherDataService } from '../../core/weather-data.service';
import { of } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

HTMLCanvasElement.prototype.getContext = jest.fn() as any;
describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  const setupTest = async (metricName: string) => {
    const activatedRouteMock = {
      snapshot: { paramMap: convertToParamMap({ metric: metricName }) },
    };

    const mockState = {
      temperatura: 20,
      humedad: 45,
      viento: 12,
      precipitacion: 1.5,
      pronostico24h: {
        horas: ['10:00'],
        temperaturas: [20],
        humedades: [45],
        vientos: [12],
        precipitaciones: [1.5],
      },
    };

    const weatherServiceSpy = { state$: of(mockState) };

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
  };

  it('debe crearse correctamente para la métrica por defecto', async () => {
    await setupTest('temperatura');
    expect(component).toBeTruthy();
    expect(component.card3.title).toBe('PRECIPITACIÓN');
  });

  it('debe configurar la gráfica y las tarjetas secundarias al visualizar precipitaciones', async () => {
    await setupTest('precipitacion');

    expect(component.tituloGrafica).toBe('Previsión de Precipitaciones (24h)');

    expect(component.card1.title).toBe('TEMPERATURA');
    expect(component.card2.title).toBe('HUMEDAD');
    expect(component.card3.title).toBe('VIENTO');

    expect(component.lineChartData.datasets[0].data).toEqual([1.5]);
  });
});
