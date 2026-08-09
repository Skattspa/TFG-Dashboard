import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { WeatherDataService } from '../../core/weather-data.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, RouterLink], 
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  // Configuración de los datos del gráfico
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [], // Aquí irán las horas
    datasets: [
      {
        data: [], // Aquí irán las temperaturas
        label: 'Temperatura (°C)',
        fill: true,
        tension: 0.4, // Curva suavizada
        borderColor: '#0055FF',
        backgroundColor: 'rgba(0, 85, 255, 0.1)'
      }
    ]
  };

  // Opciones de visualización
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false
  };

  public hasData = false;

  constructor(public weatherService: WeatherDataService) {
    // Nos suscribimos al estado global
    this.weatherService.state$.subscribe(data => {
      if (data?.pronostico24h) {
        // Formateamos la hora (ej. "2026-08-09T15:00" -> "15:00")
        this.lineChartData.labels = data.pronostico24h.horas.map(h => {
          const fecha = new Date(h);
          return `${fecha.getHours()}:00`;
        });
        
        // Asignamos las temperaturas
        this.lineChartData.datasets[0].data = data.pronostico24h.temperaturas;
        this.hasData = true;
      }
    });
  }
}