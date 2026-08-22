import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true, // Añadido para que sea standalone
  templateUrl: './app-icon.component.html',
  styleUrls: ['./app-icon.component.scss'],
})
export class AppIconComponent {
  @Input({ required: true }) name!: string;

  @Input() size: number = 24;

  get maskUrl(): string {
    return `url('/icons/icon-${this.name}.svg')`;
  }
}
