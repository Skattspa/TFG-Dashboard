import { Component, Input, ChangeDetectionStrategy, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-line-chart-wrapper',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './line-chart-wrapper.component.html',
  styleUrl: './line-chart-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class LineChartWrapperComponent implements OnDestroy {
  @Input({ required: true }) chartData!: ChartConfiguration<'line'>['data'];
  @Input() chartOptions: ChartOptions<'line'> = {};
  @Input() chartType: 'line' = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnDestroy(): void {
    if (this.chart && this.chart.chart) {
      this.chart.chart.destroy();
    }
  }
}