import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LineChartWrapperComponent } from './line-chart-wrapper.component';

describe('LineChartWrapperComponent', () => {
  let component: LineChartWrapperComponent;
  let fixture: ComponentFixture<LineChartWrapperComponent>;

  beforeEach(async () => {
    jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(() => ({}) as CanvasRenderingContext2D);
    await TestBed.configureTestingModule({
      imports: [LineChartWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartWrapperComponent);
    component = fixture.componentInstance;
    component.chartData = {
      labels: [],
      datasets: [{ data: [] }],
    };

    expect(component).toBeTruthy();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });
});
