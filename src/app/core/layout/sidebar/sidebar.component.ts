import { Component, inject, viewChild } from '@angular/core';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { SidebarService } from './sidebar.service';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { LogoComponent } from '../../../shared/components/atoms/logo/logo.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'jbt-sidebar',
  imports: [DrawerModule, MenuModule, LogoComponent, ButtonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  public readonly drawerRef = viewChild<Drawer>('drawerRef');
  public readonly sidebarService = inject(SidebarService);
  public readonly items: MenuItem[] = [
    {
      label: 'Supermercado',
      icon: 'my-svg-icon',
    },
    { label: 'Carteira', icon: 'pi pi-search' },
  ];
  public closeCallback(e: Event): void {
    this.drawerRef()?.close(e);
  }
}
