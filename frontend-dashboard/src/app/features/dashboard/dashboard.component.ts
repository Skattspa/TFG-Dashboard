import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherDataService } from '../../core/weather-data.service';
import { MetricCardComponent } from '../../shared/metric-card/metric-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MetricCardComponent], 
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  
  // Inyectamos el servicio Singleton que maneja el estado global
  constructor(public weatherService: WeatherDataService) {}

  ngOnInit(): void {
    // Al cargar la pantalla, disparamos la petición al Backend/Gateway
    this.weatherService.fetchWeatherData(); 
  }
}