import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherDataService } from '../../core/weather-data.service';
import { MetricCardComponent } from '../../shared/metric-card/metric-card.component';
import { RouterModule } from '@angular/router';
import { ErrorBannerComponent } from '../../shared/error-banner/error-banner.component';
import { SearchLocationComponent } from '../../shared/search-location/search-location.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MetricCardComponent, RouterModule, ErrorBannerComponent, SearchLocationComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  constructor(public weatherService: WeatherDataService) {}

  ngOnInit(): void {
    this.weatherService.fetchWeatherData('San Francisco');
  }
}