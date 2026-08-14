import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricCardComponent {
  @Input() title: string = 'Métrica';
  @Input() value: number | string = 0;
  @Input() unit: string = '';
  @Input() icon: string = '🌡️';
  @Input() showAction: boolean = true;
  @Input() linkRoute: string = '';
}
