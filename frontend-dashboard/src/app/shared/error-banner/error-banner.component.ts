import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [],
  templateUrl: './error-banner.component.html',
  styleUrl: './error-banner.component.scss'
})
export class ErrorBannerComponent {
  @Input() message: string = 'Ha ocurrido un error.';
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}