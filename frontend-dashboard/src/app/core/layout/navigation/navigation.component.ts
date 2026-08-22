import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from '../../../shared/icon/app-icon.component';

interface NavItem {
  label: string;
  iconName: string;
  isActive: boolean;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  // Simulación de estado y rutas. En un entorno real, usarías RouterLink.
  navItems: NavItem[] = [
    { label: 'Home', iconName: 'home', isActive: true },
    { label: 'Settings', iconName: 'settings', isActive: false },
  ];
}
