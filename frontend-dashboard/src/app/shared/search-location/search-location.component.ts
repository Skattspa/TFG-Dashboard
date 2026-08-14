import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherDataService } from '../../core/weather-data.service';

@Component({
  selector: 'app-search-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-location.component.html',
  styleUrl: './search-location.component.scss'
})
export class SearchLocationComponent {
  constructor(public weatherService: WeatherDataService) {}

  buscarCiudad(event: Event, inputElement: HTMLInputElement): void {
    event.preventDefault(); // Evita que el formulario recargue la página
    const ciudad = inputElement.value.trim();
    
    if (ciudad) {
      this.weatherService.fetchWeatherData(ciudad);
      inputElement.value = ''; // Limpiamos el input tras buscar
    }
  }
}