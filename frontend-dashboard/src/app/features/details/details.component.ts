import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { WeatherDataService } from '../../core/weather-data.service';
import { LineChartWrapperComponent } from '../../shared/line-chart-wrapper/line-chart-wrapper.component';
import { MetricCardComponent } from '../../shared/metric-card/metric-card.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterLink, LineChartWrapperComponent, MetricCardComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  public card1: any = {};
  public card2: any = {};
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Temperatura (°C)',
        fill: true,
        tension: 0.4,
        borderColor: '#0055FF',
        backgroundColor: 'rgba(0, 85, 255, 0.1)',
      },
    ],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
  };

  public hasData = false;
  public humedad: number = 0;
  public viento: number = 0;
  public tituloGrafica: string = 'Previsión de Temperatura (24h)';
  public tipoMetrica: string | null = 'temperatura';

  constructor(
    public weatherService: WeatherDataService,
    private route: ActivatedRoute,
  ) {
    this.weatherService.state$.subscribe((data) => {
      if (data?.pronostico24h) {
        this.lineChartData.labels = data.pronostico24h.horas.map((h) => {
          const fecha = new Date(h);
          return `${fecha.getHours()}:00`;
        });

        this.lineChartData.datasets[0].data = data.pronostico24h.temperaturas;
        this.humedad = data.humedad;
        this.viento = data.viento;
        this.hasData = true;
      }
    });
  }
  ngOnInit() {
    this.tipoMetrica = this.route.snapshot.paramMap.get('metric') || 'temperatura';
    this.configurarAparienciaGrafica();

    this.weatherService.state$.subscribe((data) => {
      if (data?.pronostico24h) {
        this.lineChartData.labels = data.pronostico24h.horas.map((h) => {
          const fecha = new Date(h);
          return `${fecha.getHours()}:00`;
        });

        // 1. Asignar el array correcto a la gráfica según la URL
        if (this.tipoMetrica === 'humedad' && data.pronostico24h.humedades) {
          this.lineChartData.datasets[0].data = data.pronostico24h.humedades;
        } else if (this.tipoMetrica === 'viento' && data.pronostico24h.vientos) {
          this.lineChartData.datasets[0].data = data.pronostico24h.vientos;
        } else {
          this.lineChartData.datasets[0].data = data.pronostico24h.temperaturas;
        }

        // 2. Configurar las tarjetas secundarias para mostrar lo que NO está en la gráfica
        this.configurarTarjetasSecundarias(data);

        this.hasData = true;
      }
    });
  }
  private configurarAparienciaGrafica() {
    if (this.tipoMetrica === 'humedad') {
      this.tituloGrafica = 'Previsión de Humedad Relativa (24h)';
      this.lineChartData.datasets[0].label = 'Humedad (%)';
      this.lineChartData.datasets[0].borderColor = '#0ea5e9';
      this.lineChartData.datasets[0].backgroundColor = 'rgba(14, 165, 233, 0.1)';
    } else if (this.tipoMetrica === 'viento') {
      this.tituloGrafica = 'Previsión de Velocidad del Viento (24h)';
      this.lineChartData.datasets[0].label = 'Viento (km/h)';
      this.lineChartData.datasets[0].borderColor = '#8b5cf6';
      this.lineChartData.datasets[0].backgroundColor = 'rgba(139, 92, 246, 0.1)';
    }
  }

  private configurarTarjetasSecundarias(data: any) {
    if (this.tipoMetrica === 'temperatura') {
      this.card1 = { icon: '💧', title: 'HUMEDAD', value: data.humedad, unit: '%' };
      this.card2 = { icon: '💨', title: 'VIENTO', value: data.viento, unit: 'km/h' };
    } else if (this.tipoMetrica === 'humedad') {
      this.card1 = { icon: '🌡️', title: 'TEMPERATURA', value: data.temperatura, unit: '°C' };
      this.card2 = { icon: '💨', title: 'VIENTO', value: data.viento, unit: 'km/h' };
    } else {
      // viento
      this.card1 = { icon: '🌡️', title: 'TEMPERATURA', value: data.temperatura, unit: '°C' };
      this.card2 = { icon: '💧', title: 'HUMEDAD', value: data.humedad, unit: '%' };
    }
  }
}
