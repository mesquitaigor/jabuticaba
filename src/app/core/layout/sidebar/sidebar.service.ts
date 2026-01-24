import { inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { NavigationService } from '../../navigation/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);
  public sidebarOpen = signal(false);
  public setCloseOnNavigation(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.sidebarOpen.set(false);
      }
    });
  }
  public getMenuItems(): MenuItem[] {
    return this.navigationService.getNavigationItems().map(
      (item): MenuItem => ({
        label: item.label,
        icon: item.icon,
        routerLink: item.route,
      }),
    );
  }
}
