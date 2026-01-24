import { Component, inject, OnInit, viewChild } from '@angular/core';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { SidebarService } from './sidebar.service';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { LogoComponent } from '../../../shared/components/atoms/logo/logo.component';
import { ButtonModule } from 'primeng/button';
import { NavigationEnd, Router } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';

@Component({
  selector: 'jbt-sidebar',
  imports: [DrawerModule, MenuModule, LogoComponent, ButtonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  private readonly router = inject(Router);
  public readonly drawerRef = viewChild<Drawer>('drawerRef');
  public readonly sidebarService = inject(SidebarService);
  public readonly navigationService = inject(NavigationService);
  public items: MenuItem[] = [];
  public ngOnInit(): void {
    this.items = this.sidebarService.getMenuItems();
    this.sidebarService.setCloseOnNavigation();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const navigationItem =
          this.navigationService.getNavigationItemByRoute();
        if (navigationItem) {
          this.items.forEach((item) => {
            if (item.routerLink === navigationItem.route) {
              item['styleClass'] = 'menu-active';
            } else {
              item['styleClass'] = '';
            }
          });
        }
      }
    });
  }
  public closeCallback(e: Event): void {
    this.drawerRef()?.close(e);
  }
}
