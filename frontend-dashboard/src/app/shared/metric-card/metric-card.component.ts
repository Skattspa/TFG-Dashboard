import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss'
})
export class MetricCardComponent {
  // Decoradores @Input para recibir datos desde el componente padre
  @Input() title: string = 'Métrica';
  @Input() value: number | string = 0;
  @Input() unit: string = '';
  @Input() icon: string = '🌡️'; // Usamos un emoji temporalmente como placeholder
}