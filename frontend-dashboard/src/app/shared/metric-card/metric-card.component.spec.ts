import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetricCardComponent } from './metric-card.component';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('MetricCardComponent', () => {
  let component: MetricCardComponent;
  let fixture: ComponentFixture<MetricCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricCardComponent],
      providers: [{ provide: ActivatedRoute, useValue: { params: of({}) } }],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricCardComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe renderizar el título correctamente inyectado por @Input', () => {
    component.title = 'TEST HUMEDAD';
    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(By.css('.label-caps')).nativeElement;
    expect(titleElement.textContent.trim()).toBe('TEST HUMEDAD');
  });
});
