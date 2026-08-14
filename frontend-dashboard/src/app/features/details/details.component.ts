import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { WeatherDataService } from '../../core/weather-data.service';
import { LineChartWrapperComponent } from '../../shared/line-chart-wrapper/line-chart-wrapper.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterLink, LineChartWrapperComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Temperatura (°C)',
        fill: true,
        tension: 0.4,
        borderColor: '#0055FF',
        backgroundColor: 'rgba(0, 85, 255, 0.1)'
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false
  };

  public hasData = false;

  constructor(public weatherService: WeatherDataService) {
    this.weatherService.state$.subscribe(data => {
      if (data?.pronostico24h) {
        this.lineChartData.labels = data.pronostico24h.horas.map(h => {
          const fecha = new Date(h);
          return `${fecha.getHours()}:00`;
        });

        this.lineChartData.datasets[0].data = data.pronostico24h.temperaturas;
        this.hasData = true;
      }
    });
  }
}