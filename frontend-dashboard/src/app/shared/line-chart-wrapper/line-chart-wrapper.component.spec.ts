import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartWrapperComponent } from './line-chart-wrapper.component';

describe('LineChartWrapper', () => {
  let component: LineChartWrapperComponent;
  let fixture: ComponentFixture<LineChartWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChartWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartWrapperComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
